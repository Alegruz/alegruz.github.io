---
layout: post
title:  Understanding Command Submission in Modern Graphics
date:   2024-07-24 00:00:00 +0000
categories: graphics
lang: "en"
---

One of the significant shifts in modern graphics APIs is the management of GPU commands. This shift, where developers now manage the entire lifecycle of GPU commands, from recording to submission and synchronization, is a complex and crucial challenge that underscores the importance of your expertise in this field.

A typical render loop would go as follows:
Acquire a drawable back buffer
Record GPU commands to the command buffer
Submit command buffers to logical queues for execution
Present back buffer

Acquiring a back buffer is easy, but knowing whether it is drawable is different. A back buffer is drawable if the GPU does not read or write it. If this is the first time drawing to a back buffer, then the back buffer is guaranteed to be drawable. However, once the GPU executes GPU commands for the back buffer, the back buffer becomes indrawable. When GPU completes the command buffers that reads/writes the back buffer, we can guarantee that the back buffer is drawable. The critical point would be, “Can the CPU know about the completion of a certain command buffer?”

There are some other questions aside from back buffers. Back buffers are often frame-buffered, meaning we acquire multiple back buffers from the swap chain to parallelize the rendering process. Say we submitted the 0th command buffer with the 0th back buffer; then it is possible to acquire and record commands that write/read the 1st back buffer. This scheme is valid for all frame-buffered resources. However, this is strictly from the command buffer’s viewpoint. From a resource’s standpoint, developers could use it in different modes. The resource could be written as a UAV, read as an SRV, or drawn as an RTV. Even though we submit command buffers, which we record linearly, the actual execution of the commands in the GPU is never guaranteed linear. Say the command buffer consists of three commands: a command that draws the objects in a scene, a command that draws the UI, and the final command that composites both into the back buffer. The first two commands have no dependencies on each other, but the GPU must complete them before executing the last compositing command. GPU can allocate resources to process the first two commands in parallel, but the previous must wait. GPUs can determine whether commands have dependencies via “barriers.” Barriers are resource-wise synchronization objects. From the example, say that the first command draws scene objects on a full-screen texture, and the second command draws UI elements on a separate UI-only full-screen texture, and they don’t share any resources. These two textures must transition their barrier state into a “render target state.” When interpreting the command buffers, because these two commands do not have any shared resources, GPU knows they are independent commands that it can execute in parallel. The last command would require the two textures drawn by its predecessors to be in a “share resource state, " meaning it shares resources with other commands, which hints to the GPU that GPU cannot possibly execute the last command in parallel with the first or second command.

I have briefly discussed the need for synchronization in GPU rendering, a crucial aspect most introductory readers will need help understanding. They might “understand” it but struggle to reflect it in their brains. Your role in ensuring this synchronization is vital and significant.

## Work Submission Restaurant

Let’s say you just started an Italian restaurant. You are the waiter, cashier, and chef. The restaurant only offers Bolognese pasta, the only menu item, and can only serve a single customer. A customer enters the restaurant, takes the sole table, orders a Bolognese pasta, waits for the food, eats it once served, and pays after finishing the meal. You greet the customer, offer the sole table, ask for orders, record the orders, cook, serve, wait for the customer to finish eating, and process the bills. The restaurant is a metaphor for the application. Acquiring a drawable back buffer is equivalent to a customer trying to find an empty table, recording GPU commands is the ordering process, submitting the command buffers to logical queues is the process where the expeditor processes the orders to the kitchen, and presenting is the process where the waiter offers the completed food to the orderer.

```cpp
const uint32 numTables = 1;
std::vector<Table> tables;
std::vector<Employee> employees;
std::vector<MenuItem> menu;

{
    tables = PrepareTables(numTables);
}

{
    Employee me(EmployeeType::CHEF | EmployeeType::SERVER | EmployeeType::EXPEDTIOR);
    employees.push_back(me);
    PrepareEmployees(employees);
}

{
    MenuItem bolognesePasta(MenuItemType::Main, "Bolognese Pasta");
    menu.push_back(bolognesePasta);
    PrepareMenu(menu)
}

uint32 currentTable = 0;
while (true)
{
    Table& table = tables[currentTable];

    currentTable = (currentTable + 1) % numTables;
}
```

You could improve several things in the restaurant. The restaurant's goal is to earn as much profit as possible; in other words, you need more tables, menus, and chefs and hire servers. With only one table, you have to wait for your customer to finish the meal before you can start serving for another. An employee doing nothing but waiting means no profit for that period, which is a significant loss!! You decided to add two more tables (three tables or back buffers in total). While cooking your first customer a Bolognese pasta, a new customer enters the restaurant. However, because you are the only employee, the customer has to wait until you serve your first customer. The employee might be busy serving and cooking, but the customers are waiting this time.

Making your customers wait for food is inevitable but should be kept reasonably short. The optimal scenario would be that the cooking process starts when the customers’ order arrives at the kitchen. We can either short or hide several stages from the customer. The customer is waiting for you to 1) take the order, 2) cook the food, 3) and serve the food. Taking the order step can be optimized by hiring a server. The server now greets the customer and conveys the order to the kitchen. This part is where Direct3D 11 and 12 differ. The restaurant before hiring a server is 11, and after hiring a server is 12. In Direct3D 11,  the CPU stalled when we called a draw function; this was the food ordering stage in the restaurant metaphor.

We need one more thing to deal with. Now that you have hired a server, you are only responsible for the cooking process. The server would come to you and say, “One Bolognese, please!” What happens after cooking a Bolognese pasta? You should alarm your server that you have completed cooking pasta. But how can we alarm them? Let’s say the space between the kitchen and hall is entirely different in that they cannot communicate with each other verbally. What if we create an output tray where chefs put the finished food? In this example, the server would immediately understand whose pasta this is because there was only one order. What if there were multiple orders? Can we safely assume that the chef cooks in the same order as the actual orders the server brought to the kitchen?

Another problem is that someone in charge of the kitchen expedition must constantly check the output tray for any finished food, which is tiresome! The kitchen expeditor needs to ensure the order in which the order came in and make the notification for the food process less tedious. One way to deal with this problem is to issue a ticket per order. The ticket comprises an order and a unique number. Every time a chef completes an order, the chef will notify the expeditor using its number, which the server can map to a table. In modern graphics API, this is called a “fence value.” Whenever a customer orders some food(submits a command buffer), a queue signal command(issued ticket number) follows the order. Whenever the kitchen completes an order, they notify the expeditor using the issued ticket number. If the number is issued sequentially, the FOH(front of house) can safely assume that the order submitted to the BOH(back of house) is maintained.

A restaurant that only serves pasta is not a good place to eat. You decided to hire a pastry chef and add some dessert menu items. When customers order food, they can order dessert and pasta separately. The kitchen expeditor would create two tickets for each type of food, corresponding to the chef-in-charge. The chefs in each station(a pasta station and a pastry station) will receive the submissions and schedule the ticket processing. Queuing the tickets is just like the modern graphics API’s command queues. As expeditors submit orders to each station, applications submit different command buffers to designated command queues. The station will notify FOH of the completed ticket number corresponding to a fence value signal command that a command queue can perform. If stations depend on themselves, either the expeditor or the head chef would make a depending station to wait. Command queues also can wait for a specific fence value.


