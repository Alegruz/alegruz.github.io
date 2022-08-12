import matplotlib.pyplot as plt
import numpy as np

Scene_Render_cpu = [
	0.000000,
	2.772500,
	0.511500,
	0.215500,
	1.153000,
	0.320000,
	0.267500,
	0.258000,
	0.407200,
	0.239900,
	0.270200,
	0.255800,
	0.356500,
	0.253000,
	0.244300,
	0.248500,
	0.351900,
	0.254700,
	0.258600,
	0.238200,
	0.241900,
	0.242900,
	0.371700,
	0.242200,
	0.236400,
	0.270300,
	0.344600,
	0.380100,
	0.256300,
	0.258800,
	0.247500,
	0.354100,
	0.351400,
	0.389000,
	0.278500,
	0.261200,
	0.270500,
	0.289800,
	0.401000,
	0.395300,
	0.279500,
	0.271700,
	0.282300,
	0.268800,
	0.283700,
	0.264900,
	0.322700,
	0.416900,
	0.282100,
	0.277900,
	0.249700,
	0.217700,
	0.198500,
	0.191600,
	0.203400,
	0.195600,
	0.198700,
	0.187200,
	0.182600,
	0.213800,
	0.202400,
	0.198600,
	0.243600,
	0.265300,
	0.273600,
	0.306500,
	0.290700,
	0.307000,
	0.356800,
	0.385700,
	0.307100,
	0.286000,
	0.277000,
	0.287400,
	0.364800,
	0.328400,
	0.320500,
	0.259600,
	0.279800,
	0.284900,
	0.265000,
	0.269600,
	0.286300,
	0.318100,
	0.291900,
	0.315000,
	0.382800,
	0.348300,
	0.296400,
	0.308300,
	0.281500,
	0.283100,
	0.392900,
	0.282000,
	0.299900,
	0.359200,
	0.282500,
	0.295900,
	0.268800,
	0.289000,
	0.299200,
	0.375100,
	0.245800,
	0.272800,
	0.267600,
	0.291100,
	0.267100,
	0.316000,
	0.280200,
	0.266900,
	0.248300,
	0.260400,
	0.290000,
	0.217900,
	0.192400,
	0.203800,
	0.187900,
	0.191600,
	0.176000,
	0.179300,
	0.173800,
	0.248600,
	0.193400,
	0.202500,
	0.352400,
	0.274300,
	0.228400,
	0.200700,
	0.184100,
	0.179000,
	0.198700,
	0.182600,
	0.173300,
	0.208200,
	0.189300,
	0.176700,
	0.208800,
	0.317500,
	0.245700,
	0.205900,
	0.206500,
	0.189700,
	0.180000,
	0.193600,
	0.184700,
	0.209500,
	0.191700,
	0.182300,
	0.185700,
	0.247200,
	0.288100,
	0.216700,
	0.209200,
	0.188100,
	0.175000,
	0.174400,
	0.182300,
	0.208400,
	0.184300,
	0.201000,
	0.188900,
	0.179400,
	0.284400,
	0.279600,
	0.223400,
	0.199100,
	0.182000,
	0.177300,
	0.184400,
	0.184900,
	0.198200,
	0.183200,
	0.197400,
	0.189400,
	0.182000,
	0.305600,
	0.283400,
	0.310500,
	0.260900,
	0.257700,
	0.256000,
	0.243300,
	0.223200,
	0.202000,
	0.203000,
	0.195500,
	0.197300,
	0.202200,
	0.224800,
	0.280000,
	0.222900,
	0.198200,
	0.180900,
	0.246100,
	0.241600,
	0.205000,
	0.202700,
	0.189200,
	0.198800,
	0.181100,
	0.186900,
	0.216700,
	0.279800,
	0.217100,
	0.202500,
	0.202300,
	0.224300,
	0.195400,
	0.184300,
	0.184400,
	0.187100,
	0.189300,
	0.180300,
	0.183400,
	0.272100,
	0.245700,
	0.206600,
	0.195000,
	0.196800,
	0.231900,
	0.196600,
	0.198500,
	0.182000,
	0.298500,
	0.443500,
	0.278000,
	0.285900,
	0.254100,
	0.258700,
	0.244400,
	0.215300,
	0.213400,
	0.201400,
	0.201800,
	0.199200,
	0.205700,
	0.200600,
	0.198200,
	0.190700,
	0.265000,
	0.271400,
	0.224400,
	0.190600,
	0.220300,
	0.221900,
	0.199000,
	0.184700,
	0.205500,
	0.187200,
	0.183100,
	0.191100,
	0.309900,
	0.256800,
	0.241800,
	0.204100,
	0.239200,
	0.204300,
	0.194500,
	0.181100,
	0.191200,
	0.180400,
	0.194600,
	0.190100,
	0.282800,
	0.238900,
	0.263600,
	0.253700,
	0.253100,
	0.240200,
	0.272400,
	0.397900,
	0.264000,
	0.250300,
	0.196900,
	0.180900,
	0.275800,
	0.266100,
	0.215500,
	0.182700,
	0.199700,
	0.205100,
	0.195400,
	0.182300,
	0.317700,
	0.375700,
	0.268900,
	0.211700,
	0.269100,
	0.298100,
	0.272400,
	0.210000,
	0.214700,
	0.192400,
	0.188900,
	0.184300,
	0.185200,
	0.193800,
	0.185900,
	0.186000,
	0.189800,
	0.268500,
	0.255000,
	0.305700,
	0.200900,
	0.214600,
	0.204800,
	0.185500,
	0.189700,
	0.191200,
	0.191200,
	0.176700,
	0.183600,
	0.266300,
	0.276800,
	0.198300,
	0.216400,
	0.203700,
	0.192700,
	0.175300,
	0.186900,
	0.175300,
	0.174200,
	0.185600,
	0.179500,
	0.182300,
	0.249600,
	0.286400,
	0.207100,
	0.188600,
	0.216900,
	0.202300,
	0.183900,
	0.179500,
	0.187200,
	0.182500,
	0.182500,
	0.176800,
	0.183000,
	0.234500,
	0.260500,
	0.302600,
	0.220900,
	0.210800,
	0.213300,
	0.197900,
	0.233700,
	0.210400,
	0.198900,
	0.197000,
	0.199800,
	0.175900,
	0.242900,
	0.264300,
	0.255200,
	0.251500,
	0.226700,
	0.199400,
	0.183600,
	0.184000,
	0.182500,
	0.182700,
	0.189600,
	0.177000,
	0.185600,
	0.313100,
	0.270000,
	0.202900,
	0.230400,
	0.203800,
	0.198500,
	0.196100,
	0.200700,
	0.179700,
	0.188000,
	0.182900,
	0.190700,
	0.175200,
	0.266700,
	0.247300,
	0.274000,
	0.225200,
	0.187700,
	0.215500,
	0.194100,
	0.189200,
	0.196100,
	0.256600,
	0.199800,
	0.179000,
	0.247100,
	0.268600,
	0.253600,
	0.200900,
	0.202900,
	0.194400,
	0.182800,
	0.180000,
	0.185700,
	0.171200,
	0.251500,
	0.209700,
	0.263900,
	0.277300,
	0.246600,
	0.249400,
	0.208500,
	0.211800,
	0.194100,
	0.184000,
	0.186300,
	0.182100,
	0.179000,
	0.201300,
	0.213700,
	0.274000,
	0.231600,
	0.285700,
	0.206300,
	0.185700,
	0.211300,
	0.198700,
	0.173300,
	0.170100,
	0.174500,
	0.177800,
	0.254800,
	0.252800,
	0.295300,
	0.247400,
	0.212500,
	0.218200,
	0.204000,
	0.181300,
	0.188200,
	0.175800,
	0.179400,
	0.173200,
	0.171000,
	0.195000,
	0.283500,
	0.263500,
	0.260500,
	0.209800,
	0.203700,
	0.184400,
	0.191100,
	0.187000,
	0.198000,
	0.182600,
	0.174800,
	0.179100,
	0.181400,
	0.255100,
	0.273600,
	0.345000,
	0.222600,
	0.223200,
	0.202100,
	0.183200,
	0.184200,
	0.179900,
	0.182900,
	0.181400,
	0.183200,
	0.263100,
	0.274300,
	0.217300,
	0.191000,
	0.179700,
	0.183600,
	0.173200,
	0.173600,
	0.180600,
	0.186800,
	0.173100,
	0.239400,
	0.185300,
	0.263500,
	0.276400,
	0.285700,
	0.220700,
	0.197600,
	0.175500,
	0.182400,
	0.182000,
	0.183700,
	0.181200,
	0.179600,
	0.184100,
	0.196300,
	0.289600,
	0.264700,
	0.235200,
	0.224100,
	0.193900,
	0.189100,
	0.185000,
	0.176100,
	0.181200,
	0.186900,
	0.214900,
	0.202000,
	0.248000,
	0.280600,
	0.216100,
	0.219900,
	0.194800,
	0.202500,
	0.184300,
	0.179500,
	0.171900,
	0.184200,
	]
Scene_Render_gpu = [
	0.000000,
	0.000000,
	8.473600,
	3.047424,
	3.009536,
	3.034112,
	3.664896,
	3.888128,
	3.613696,
	3.580928,
	3.596288,
	3.933184,
	3.628032,
	4.037632,
	3.674112,
	3.908608,
	3.622912,
	3.811328,
	3.473408,
	3.713024,
	3.431424,
	3.653632,
	3.383296,
	3.598336,
	3.326976,
	3.580928,
	3.347456,
	3.593216,
	3.360768,
	3.641344,
	3.374080,
	3.649536,
	3.387392,
	3.633152,
	3.521536,
	3.580928,
	3.326976,
	3.261440,
	3.303424,
	3.517440,
	3.267584,
	3.489792,
	3.222528,
	3.158016,
	3.180544,
	3.415040,
	2.681856,
	3.405824,
	3.145728,
	3.382272,
	3.164160,
	3.402752,
	3.437568,
	3.391488,
	3.388416,
	3.330048,
	3.092480,
	3.331072,
	3.406848,
	3.354624,
	3.374080,
	3.392512,
	3.086336,
	3.385344,
	3.092480,
	3.425280,
	2.983936,
	3.086336,
	3.014656,
	3.007488,
	3.292160,
	3.295232,
	3.171328,
	3.447808,
	3.161088,
	3.493888,
	3.137536,
	3.437568,
	3.099648,
	3.402752,
	3.131392,
	3.444736,
	3.290112,
	3.471360,
	3.380224,
	3.446784,
	2.656256,
	3.335168,
	3.093504,
	3.281920,
	3.093504,
	3.283968,
	2.996224,
	3.445760,
	3.349504,
	3.158016,
	3.279872,
	3.298304,
	3.277824,
	3.012608,
	3.035136,
	3.076096,
	2.979840,
	2.957312,
	2.966528,
	3.009536,
	2.955264,
	3.008512,
	2.859008,
	2.915328,
	2.947072,
	3.025920,
	2.926592,
	3.026944,
	3.077120,
	3.002368,
	3.052544,
	3.009536,
	3.068928,
	3.008512,
	3.038208,
	3.007488,
	3.046400,
	2.975744,
	2.959360,
	2.978816,
	3.053568,
	3.016704,
	3.032064,
	2.989056,
	3.004416,
	2.989056,
	3.004416,
	2.996224,
	3.017728,
	2.962432,
	2.966528,
	2.869248,
	2.926592,
	2.964480,
	2.897920,
	2.924544,
	2.968576,
	2.930688,
	2.972672,
	2.900992,
	2.881536,
	2.903040,
	2.940928,
	2.846720,
	2.784256,
	2.846720,
	2.865152,
	2.838528,
	2.847744,
	2.819072,
	2.889728,
	2.790400,
	2.834432,
	2.768896,
	2.871296,
	2.761728,
	2.764800,
	2.728960,
	2.800640,
	2.749440,
	2.779136,
	2.795520,
	2.830336,
	2.772992,
	2.811904,
	2.760704,
	2.810880,
	2.750464,
	2.817024,
	3.024896,
	2.652160,
	3.025920,
	2.757632,
	2.990080,
	2.719744,
	2.732032,
	2.700288,
	2.723840,
	2.678784,
	2.620416,
	2.646016,
	2.654208,
	2.674688,
	2.455552,
	2.570240,
	2.600960,
	2.627584,
	2.520064,
	2.068480,
	2.499584,
	2.591744,
	2.482176,
	2.573312,
	2.467840,
	2.493440,
	2.437120,
	2.334720,
	2.438144,
	2.469888,
	2.460672,
	2.496512,
	2.442240,
	2.480128,
	2.435072,
	2.458624,
	2.405376,
	2.439168,
	2.430976,
	2.298880,
	2.386944,
	2.403328,
	2.351104,
	2.380800,
	2.361344,
	2.408448,
	2.368512,
	2.381824,
	2.370560,
	1.897472,
	2.329600,
	2.232320,
	2.405376,
	1.922048,
	2.392064,
	1.901568,
	2.374656,
	2.412544,
	2.353152,
	2.388992,
	2.288640,
	2.320384,
	2.282496,
	2.311168,
	2.183168,
	2.072576,
	2.229248,
	2.324480,
	2.244608,
	1.783808,
	2.324480,
	2.367488,
	2.312192,
	2.395136,
	2.469888,
	2.487296,
	2.443264,
	2.332672,
	2.451456,
	2.523136,
	2.485248,
	2.515968,
	2.450432,
	2.535424,
	2.496512,
	2.552832,
	2.531328,
	2.580480,
	2.499584,
	2.033664,
	2.511872,
	2.036736,
	2.557952,
	2.071552,
	2.587648,
	2.083840,
	2.606080,
	2.599936,
	2.621440,
	2.662400,
	2.492416,
	2.501632,
	2.581504,
	2.655232,
	2.656256,
	2.665472,
	2.612224,
	2.735104,
	2.663424,
	2.655232,
	2.677760,
	2.677760,
	2.650112,
	2.572288,
	2.737152,
	2.758656,
	2.682880,
	2.795520,
	2.689024,
	2.761728,
	2.692096,
	2.742272,
	2.783232,
	2.764800,
	2.790400,
	2.767872,
	2.862080,
	2.690048,
	2.809856,
	2.768896,
	2.788352,
	2.793472,
	2.752512,
	2.803712,
	2.764800,
	2.812928,
	2.823168,
	2.806784,
	2.676736,
	2.863104,
	2.852864,
	2.847744,
	2.832384,
	2.886656,
	2.875392,
	2.940928,
	2.922496,
	2.995200,
	2.965504,
	2.998272,
	2.975744,
	2.910208,
	3.317760,
	3.323904,
	2.982912,
	3.043328,
	3.007488,
	3.052544,
	2.997248,
	3.057664,
	3.015680,
	3.037184,
	3.018752,
	3.039232,
	3.309568,
	2.926592,
	3.305472,
	3.088384,
	3.371008,
	3.129344,
	3.324928,
	3.431424,
	3.355648,
	3.099648,
	3.349504,
	3.382272,
	3.352576,
	3.066880,
	3.245056,
	3.258368,
	3.397632,
	3.427328,
	3.415040,
	3.530752,
	3.545088,
	3.553280,
	3.502080,
	3.526656,
	3.469312,
	3.091456,
	2.924544,
	3.355648,
	3.019776,
	3.360768,
	3.343360,
	3.422208,
	3.482624,
	3.629056,
	3.620864,
	3.793920,
	3.783680,
	3.905536,
	3.870720,
	3.555328,
	3.738624,
	3.946496,
	3.945472,
	3.996672,
	3.896320,
	3.946496,
	3.887104,
	3.692544,
	3.983360,
	4.033536,
	3.984384,
	3.713024,
	3.889152,
	4.032512,
	4.023296,
	3.699712,
	4.023296,
	4.125696,
	3.983360,
	4.006912,
	3.962880,
	3.612672,
	3.936256,
	3.901440,
	3.795968,
	3.524608,
	3.665920,
	3.659776,
	3.656704,
	3.608576,
	3.587072,
	3.638272,
	3.593216,
	3.664896,
	3.639296,
	3.532800,
	3.687424,
	3.421184,
	3.650560,
	3.651584,
	3.602432,
	3.619840,
	3.571712,
	3.597312,
	3.532800,
	3.554304,
	3.524608,
	3.241984,
	3.386368,
	3.383296,
	3.479552,
	3.210240,
	3.447808,
	3.463168,
	3.446784,
	3.495936,
	3.425280,
	3.477504,
	3.403776,
	3.154944,
	3.396608,
	3.107840,
	3.231744,
	3.124224,
	3.368960,
	3.433472,
	3.362816,
	3.415040,
	3.065856,
	3.126272,
	3.360768,
	3.387392,
	3.368960,
	3.103744,
	3.260416,
	3.335168,
	3.404800,
	3.133440,
	3.469312,
	3.448832,
	3.401728,
	3.471360,
	3.375104,
	3.453952,
	3.436544,
	3.303424,
	3.302400,
	3.479552,
	3.419136,
	3.468288,
	3.405824,
	3.440640,
	3.049472,
	3.359744,
	3.106816,
	3.116032,
	3.397632,
	3.165184,
	3.123200,
	3.046400,
	3.396608,
	3.451904,
	3.397632,
	3.459072,
	3.394560,
	3.146752,
	3.081216,
	3.375104,
	3.333120,
	3.082240,
	3.037184,
	3.008512,
	3.038208,
	2.915328,
	3.005440,
	3.066880,
	3.004416,
	3.065856,
	3.008512,
	3.089408,
	3.032064,
	3.056640,
	3.022848,
	2.966528,
	2.911232,
	3.032064,
	3.015680,
	3.045376,
	2.999296,
	3.030016,
	2.985984,
	3.065856,
	2.998272,
	]
# Scene Render:
#	CPU TIME:	0.236635, 512
#	GPU TIME:	3.064430, 512
Clustered_cpu = [
	0.000000,
	0.031900,
	0.011400,
	0.008800,
	0.006600,
	0.006300,
	0.010100,
	0.009800,
	0.008700,
	0.009900,
	0.010900,
	0.009400,
	0.013500,
	0.010400,
	0.009200,
	0.009400,
	0.014400,
	0.010400,
	0.009500,
	0.010000,
	0.008900,
	0.008800,
	0.013600,
	0.009700,
	0.009700,
	0.011000,
	0.013600,
	0.014800,
	0.009900,
	0.010400,
	0.009700,
	0.014500,
	0.014000,
	0.015400,
	0.010800,
	0.010500,
	0.009800,
	0.011000,
	0.015400,
	0.015200,
	0.010100,
	0.011000,
	0.010900,
	0.010700,
	0.010700,
	0.010300,
	0.013100,
	0.015000,
	0.010200,
	0.010800,
	0.010400,
	0.008800,
	0.006700,
	0.007600,
	0.007800,
	0.007300,
	0.007300,
	0.007700,
	0.006800,
	0.008100,
	0.007500,
	0.007600,
	0.009700,
	0.010700,
	0.009900,
	0.013700,
	0.013600,
	0.011100,
	0.011900,
	0.015200,
	0.011400,
	0.012400,
	0.010200,
	0.011700,
	0.014000,
	0.012800,
	0.011500,
	0.010000,
	0.011000,
	0.010900,
	0.010100,
	0.010400,
	0.010300,
	0.013600,
	0.011700,
	0.012800,
	0.012300,
	0.015500,
	0.010400,
	0.011900,
	0.010800,
	0.010400,
	0.010800,
	0.009900,
	0.010800,
	0.009800,
	0.011500,
	0.010700,
	0.010200,
	0.011400,
	0.010800,
	0.015200,
	0.009800,
	0.011700,
	0.010200,
	0.011300,
	0.010500,
	0.012300,
	0.010800,
	0.010500,
	0.009400,
	0.010700,
	0.010900,
	0.008800,
	0.007500,
	0.007400,
	0.006700,
	0.007600,
	0.006200,
	0.006000,
	0.006400,
	0.009600,
	0.007500,
	0.008000,
	0.009600,
	0.010200,
	0.008800,
	0.007900,
	0.006800,
	0.005800,
	0.006800,
	0.006900,
	0.006200,
	0.007600,
	0.006600,
	0.006100,
	0.007900,
	0.012800,
	0.009400,
	0.007900,
	0.007800,
	0.006700,
	0.006200,
	0.007500,
	0.006500,
	0.008100,
	0.006400,
	0.007100,
	0.006100,
	0.008100,
	0.013400,
	0.009000,
	0.007400,
	0.006500,
	0.005900,
	0.006000,
	0.006800,
	0.007800,
	0.007200,
	0.007200,
	0.006800,
	0.006400,
	0.009800,
	0.010900,
	0.008800,
	0.007800,
	0.006200,
	0.007000,
	0.006600,
	0.006400,
	0.007400,
	0.006700,
	0.007200,
	0.007100,
	0.006500,
	0.009200,
	0.011100,
	0.010400,
	0.010000,
	0.010200,
	0.010200,
	0.009800,
	0.009000,
	0.007600,
	0.007100,
	0.007600,
	0.007400,
	0.007700,
	0.008800,
	0.010900,
	0.008900,
	0.007800,
	0.006300,
	0.010000,
	0.009700,
	0.008600,
	0.008000,
	0.007000,
	0.007200,
	0.007100,
	0.007100,
	0.008600,
	0.010100,
	0.009100,
	0.008400,
	0.008000,
	0.008700,
	0.008000,
	0.006400,
	0.006600,
	0.006700,
	0.007000,
	0.006700,
	0.006700,
	0.009500,
	0.009400,
	0.008000,
	0.006700,
	0.007100,
	0.008800,
	0.007400,
	0.007400,
	0.006700,
	0.013100,
	0.016700,
	0.010500,
	0.010900,
	0.010400,
	0.009700,
	0.009400,
	0.008200,
	0.008600,
	0.007400,
	0.007600,
	0.007300,
	0.007900,
	0.008000,
	0.007600,
	0.006700,
	0.010600,
	0.009900,
	0.009300,
	0.007000,
	0.008600,
	0.008300,
	0.007600,
	0.007100,
	0.007900,
	0.006800,
	0.007000,
	0.006900,
	0.010800,
	0.010400,
	0.010000,
	0.008400,
	0.009200,
	0.007400,
	0.006900,
	0.007100,
	0.007000,
	0.006900,
	0.007200,
	0.007400,
	0.010600,
	0.010000,
	0.010500,
	0.009700,
	0.009700,
	0.009100,
	0.010400,
	0.014700,
	0.010400,
	0.011300,
	0.008200,
	0.005900,
	0.011000,
	0.011100,
	0.008500,
	0.005900,
	0.007400,
	0.008700,
	0.007800,
	0.005900,
	0.010900,
	0.013900,
	0.010700,
	0.008600,
	0.010900,
	0.011500,
	0.010200,
	0.008600,
	0.008400,
	0.006300,
	0.007200,
	0.006300,
	0.007100,
	0.006500,
	0.007000,
	0.006200,
	0.006600,
	0.009400,
	0.009900,
	0.009300,
	0.007700,
	0.007600,
	0.007800,
	0.006900,
	0.006700,
	0.006500,
	0.006600,
	0.006000,
	0.006500,
	0.008200,
	0.010500,
	0.008000,
	0.007700,
	0.008100,
	0.007200,
	0.005700,
	0.006900,
	0.006000,
	0.006600,
	0.006800,
	0.006300,
	0.006800,
	0.010100,
	0.009900,
	0.009000,
	0.007100,
	0.008600,
	0.007900,
	0.007400,
	0.006600,
	0.006900,
	0.006600,
	0.006600,
	0.006300,
	0.006600,
	0.009000,
	0.010600,
	0.010100,
	0.008900,
	0.008700,
	0.009100,
	0.007600,
	0.008800,
	0.008000,
	0.007100,
	0.007400,
	0.007600,
	0.005600,
	0.009500,
	0.010100,
	0.010500,
	0.010000,
	0.009400,
	0.007500,
	0.006900,
	0.006400,
	0.006600,
	0.006300,
	0.007000,
	0.006500,
	0.006600,
	0.010400,
	0.010400,
	0.007700,
	0.008500,
	0.007500,
	0.007600,
	0.007000,
	0.007700,
	0.006400,
	0.006800,
	0.006700,
	0.006500,
	0.006400,
	0.010400,
	0.009400,
	0.010500,
	0.009100,
	0.006700,
	0.008400,
	0.007900,
	0.006600,
	0.007300,
	0.009500,
	0.008600,
	0.006000,
	0.009600,
	0.009400,
	0.010300,
	0.008500,
	0.008000,
	0.007000,
	0.007400,
	0.006200,
	0.006600,
	0.005900,
	0.009600,
	0.008200,
	0.010100,
	0.010600,
	0.009500,
	0.008500,
	0.008100,
	0.008300,
	0.007500,
	0.006500,
	0.006200,
	0.006200,
	0.007200,
	0.007600,
	0.008300,
	0.010900,
	0.009900,
	0.008400,
	0.008300,
	0.006400,
	0.008300,
	0.007400,
	0.005900,
	0.006200,
	0.006500,
	0.005900,
	0.009800,
	0.007400,
	0.011600,
	0.009600,
	0.008400,
	0.008400,
	0.008400,
	0.007000,
	0.006500,
	0.006100,
	0.005800,
	0.005800,
	0.006300,
	0.007500,
	0.010000,
	0.010300,
	0.010100,
	0.008600,
	0.008100,
	0.006600,
	0.007300,
	0.006400,
	0.006900,
	0.006600,
	0.006800,
	0.006400,
	0.006900,
	0.009700,
	0.010900,
	0.009900,
	0.008600,
	0.008500,
	0.008100,
	0.006400,
	0.006600,
	0.006300,
	0.006500,
	0.006600,
	0.006800,
	0.009900,
	0.011300,
	0.008800,
	0.007100,
	0.006500,
	0.006600,
	0.005700,
	0.005900,
	0.006700,
	0.006800,
	0.005900,
	0.009600,
	0.006800,
	0.009900,
	0.010600,
	0.010500,
	0.008300,
	0.007400,
	0.006100,
	0.006700,
	0.006600,
	0.006800,
	0.006000,
	0.006500,
	0.006100,
	0.007500,
	0.011000,
	0.010200,
	0.009500,
	0.009000,
	0.007400,
	0.007700,
	0.006200,
	0.006400,
	0.006100,
	0.006700,
	0.006700,
	0.007500,
	0.009800,
	0.011000,
	0.008500,
	0.008800,
	0.007100,
	0.007500,
	0.006400,
	0.006300,
	0.005900,
	0.005900,
	]
Clustered_gpu = [
	0.000000,
	0.000000,
	0.590848,
	0.607232,
	0.592896,
	0.595968,
	0.593920,
	0.594944,
	0.601088,
	0.594944,
	0.599040,
	0.601088,
	0.607232,
	0.610304,
	0.611328,
	0.611328,
	0.610304,
	0.615424,
	0.610304,
	0.610304,
	0.613376,
	0.613376,
	0.613376,
	0.615424,
	0.615424,
	0.609280,
	0.607232,
	0.605184,
	0.601088,
	0.600064,
	0.599040,
	0.599040,
	0.595968,
	0.593920,
	0.592896,
	0.593920,
	0.593920,
	0.592896,
	0.589824,
	0.586752,
	0.585728,
	0.582656,
	0.582656,
	0.580608,
	0.579584,
	0.579584,
	0.579584,
	0.579584,
	0.578560,
	0.577536,
	0.574464,
	0.573440,
	0.572416,
	0.570368,
	0.569344,
	0.578560,
	0.568320,
	0.565248,
	0.564224,
	0.563200,
	0.562176,
	0.562176,
	0.559104,
	0.563200,
	0.560128,
	0.558080,
	0.564224,
	0.557056,
	0.556032,
	0.557056,
	0.562176,
	0.564224,
	0.557056,
	0.558080,
	0.556032,
	0.567296,
	0.560128,
	0.556032,
	0.556032,
	0.556032,
	0.557056,
	0.559104,
	0.557056,
	0.569344,
	0.565248,
	0.561152,
	0.566272,
	0.569344,
	0.562176,
	0.567296,
	0.566272,
	0.566272,
	0.575488,
	0.564224,
	0.567296,
	0.567296,
	0.570368,
	0.571392,
	0.572416,
	0.571392,
	0.569344,
	0.568320,
	0.564224,
	0.565248,
	0.564224,
	0.563200,
	0.563200,
	0.562176,
	0.559104,
	0.559104,
	0.560128,
	0.558080,
	0.553984,
	0.555008,
	0.557056,
	0.557056,
	0.559104,
	0.558080,
	0.557056,
	0.558080,
	0.565248,
	0.559104,
	0.558080,
	0.559104,
	0.559104,
	0.558080,
	0.559104,
	0.556032,
	0.557056,
	0.557056,
	0.557056,
	0.555008,
	0.556032,
	0.556032,
	0.558080,
	0.559104,
	0.556032,
	0.555008,
	0.556032,
	0.557056,
	0.560128,
	0.561152,
	0.562176,
	0.564224,
	0.565248,
	0.566272,
	0.567296,
	0.565248,
	0.564224,
	0.561152,
	0.560128,
	0.561152,
	0.560128,
	0.560128,
	0.560128,
	0.559104,
	0.555008,
	0.552960,
	0.552960,
	0.553984,
	0.553984,
	0.553984,
	0.557056,
	0.560128,
	0.564224,
	0.562176,
	0.561152,
	0.560128,
	0.559104,
	0.558080,
	0.556032,
	0.557056,
	0.558080,
	0.560128,
	0.560128,
	0.560128,
	0.556032,
	0.552960,
	0.550912,
	0.547840,
	0.542720,
	0.545792,
	0.540672,
	0.538624,
	0.537600,
	0.533504,
	0.531456,
	0.533504,
	0.528384,
	0.524288,
	0.523264,
	0.522240,
	0.523264,
	0.526336,
	0.526336,
	0.523264,
	0.523264,
	0.523264,
	0.522240,
	0.520192,
	0.518144,
	0.518144,
	0.520192,
	0.524288,
	0.527360,
	0.527360,
	0.527360,
	0.527360,
	0.526336,
	0.526336,
	0.526336,
	0.525312,
	0.525312,
	0.525312,
	0.524288,
	0.518144,
	0.514048,
	0.512000,
	0.514048,
	0.515072,
	0.514048,
	0.515072,
	0.516096,
	0.520192,
	0.521216,
	0.521216,
	0.523264,
	0.522240,
	0.521216,
	0.519168,
	0.517120,
	0.516096,
	0.517120,
	0.514048,
	0.516096,
	0.521216,
	0.520192,
	0.520192,
	0.521216,
	0.521216,
	0.522240,
	0.522240,
	0.521216,
	0.521216,
	0.520192,
	0.522240,
	0.523264,
	0.524288,
	0.524288,
	0.522240,
	0.522240,
	0.521216,
	0.521216,
	0.520192,
	0.522240,
	0.522240,
	0.523264,
	0.523264,
	0.524288,
	0.525312,
	0.526336,
	0.527360,
	0.527360,
	0.526336,
	0.525312,
	0.528384,
	0.528384,
	0.528384,
	0.529408,
	0.528384,
	0.531456,
	0.531456,
	0.529408,
	0.529408,
	0.528384,
	0.528384,
	0.527360,
	0.525312,
	0.526336,
	0.527360,
	0.528384,
	0.528384,
	0.531456,
	0.534528,
	0.535552,
	0.536576,
	0.536576,
	0.537600,
	0.535552,
	0.536576,
	0.537600,
	0.536576,
	0.535552,
	0.535552,
	0.534528,
	0.535552,
	0.534528,
	0.535552,
	0.534528,
	0.536576,
	0.538624,
	0.538624,
	0.545792,
	0.539648,
	0.538624,
	0.537600,
	0.536576,
	0.535552,
	0.536576,
	0.538624,
	0.539648,
	0.542720,
	0.545792,
	0.543744,
	0.543744,
	0.545792,
	0.545792,
	0.547840,
	0.551936,
	0.553984,
	0.557056,
	0.560128,
	0.562176,
	0.564224,
	0.564224,
	0.563200,
	0.563200,
	0.568320,
	0.563200,
	0.561152,
	0.562176,
	0.561152,
	0.560128,
	0.561152,
	0.559104,
	0.559104,
	0.557056,
	0.556032,
	0.553984,
	0.555008,
	0.555008,
	0.555008,
	0.558080,
	0.556032,
	0.555008,
	0.556032,
	0.555008,
	0.552960,
	0.551936,
	0.549888,
	0.550912,
	0.549888,
	0.548864,
	0.547840,
	0.548864,
	0.548864,
	0.544768,
	0.542720,
	0.545792,
	0.547840,
	0.548864,
	0.551936,
	0.551936,
	0.551936,
	0.552960,
	0.553984,
	0.553984,
	0.553984,
	0.555008,
	0.556032,
	0.557056,
	0.557056,
	0.558080,
	0.564224,
	0.564224,
	0.567296,
	0.573440,
	0.574464,
	0.576512,
	0.581632,
	0.580608,
	0.582656,
	0.586752,
	0.587776,
	0.588800,
	0.589824,
	0.590848,
	0.594944,
	0.598016,
	0.598016,
	0.596992,
	0.599040,
	0.600064,
	0.603136,
	0.607232,
	0.608256,
	0.615424,
	0.616448,
	0.617472,
	0.616448,
	0.615424,
	0.615424,
	0.614400,
	0.614400,
	0.619520,
	0.618496,
	0.617472,
	0.619520,
	0.618496,
	0.613376,
	0.609280,
	0.606208,
	0.603136,
	0.600064,
	0.600064,
	0.600064,
	0.594944,
	0.593920,
	0.593920,
	0.594944,
	0.593920,
	0.591872,
	0.588800,
	0.586752,
	0.584704,
	0.582656,
	0.580608,
	0.585728,
	0.580608,
	0.580608,
	0.580608,
	0.578560,
	0.578560,
	0.577536,
	0.575488,
	0.573440,
	0.572416,
	0.570368,
	0.569344,
	0.571392,
	0.567296,
	0.565248,
	0.563200,
	0.564224,
	0.563200,
	0.562176,
	0.559104,
	0.557056,
	0.559104,
	0.557056,
	0.556032,
	0.557056,
	0.557056,
	0.556032,
	0.557056,
	0.557056,
	0.555008,
	0.556032,
	0.556032,
	0.558080,
	0.555008,
	0.556032,
	0.556032,
	0.557056,
	0.557056,
	0.558080,
	0.558080,
	0.558080,
	0.560128,
	0.561152,
	0.561152,
	0.564224,
	0.562176,
	0.562176,
	0.565248,
	0.566272,
	0.565248,
	0.565248,
	0.567296,
	0.567296,
	0.570368,
	0.572416,
	0.571392,
	0.570368,
	0.569344,
	0.568320,
	0.564224,
	0.566272,
	0.564224,
	0.564224,
	0.562176,
	0.561152,
	0.560128,
	0.560128,
	0.559104,
	0.559104,
	0.555008,
	0.555008,
	0.557056,
	0.558080,
	0.557056,
	0.558080,
	0.558080,
	0.559104,
	0.560128,
	0.558080,
	0.558080,
	0.558080,
	0.559104,
	0.558080,
	0.559104,
	0.556032,
	]
# Clustered:
#	CPU TIME:	0.008661, 512
#	GPU TIME:	0.556962, 512
OPAQUE_cpu = [
	0.000000,
	0.031500,
	0.008700,
	0.008500,
	0.006700,
	0.006800,
	0.008600,
	0.008400,
	0.009600,
	0.008500,
	0.008100,
	0.008300,
	0.013100,
	0.008000,
	0.008200,
	0.008300,
	0.012600,
	0.008600,
	0.008100,
	0.008500,
	0.008600,
	0.008400,
	0.012600,
	0.008500,
	0.007800,
	0.008500,
	0.012900,
	0.014100,
	0.008700,
	0.008700,
	0.008200,
	0.013600,
	0.012200,
	0.014000,
	0.009000,
	0.008400,
	0.009100,
	0.012900,
	0.013900,
	0.014400,
	0.009000,
	0.009200,
	0.009100,
	0.008500,
	0.008800,
	0.008800,
	0.014500,
	0.013800,
	0.008900,
	0.009100,
	0.008600,
	0.007300,
	0.007700,
	0.007400,
	0.007600,
	0.006800,
	0.007800,
	0.006800,
	0.007300,
	0.007500,
	0.007200,
	0.007700,
	0.008100,
	0.008500,
	0.008300,
	0.010600,
	0.009700,
	0.009100,
	0.009700,
	0.011400,
	0.010000,
	0.008900,
	0.008600,
	0.009400,
	0.009600,
	0.009500,
	0.008600,
	0.008700,
	0.009000,
	0.009500,
	0.008900,
	0.009000,
	0.008800,
	0.009200,
	0.009600,
	0.009700,
	0.015400,
	0.012000,
	0.009400,
	0.010100,
	0.008900,
	0.009000,
	0.009300,
	0.008800,
	0.009000,
	0.007700,
	0.008500,
	0.011800,
	0.009700,
	0.008700,
	0.009100,
	0.013500,
	0.008600,
	0.009100,
	0.008800,
	0.009600,
	0.008900,
	0.009600,
	0.008900,
	0.009400,
	0.008700,
	0.008800,
	0.008700,
	0.007600,
	0.007200,
	0.007100,
	0.007000,
	0.007600,
	0.007200,
	0.006600,
	0.006500,
	0.008400,
	0.006700,
	0.007400,
	0.009300,
	0.008500,
	0.007800,
	0.007000,
	0.006800,
	0.007200,
	0.006900,
	0.007100,
	0.006800,
	0.007800,
	0.007200,
	0.006600,
	0.007900,
	0.011800,
	0.008900,
	0.006900,
	0.007400,
	0.006900,
	0.006700,
	0.006800,
	0.006800,
	0.007900,
	0.007800,
	0.006700,
	0.006700,
	0.008200,
	0.009000,
	0.007300,
	0.006700,
	0.006900,
	0.006500,
	0.006700,
	0.006800,
	0.007700,
	0.007400,
	0.007000,
	0.007300,
	0.006800,
	0.008400,
	0.009000,
	0.007100,
	0.007300,
	0.007200,
	0.007000,
	0.006700,
	0.007000,
	0.007500,
	0.007500,
	0.006900,
	0.007400,
	0.006600,
	0.022400,
	0.008600,
	0.008400,
	0.008600,
	0.008700,
	0.008000,
	0.008600,
	0.007800,
	0.006900,
	0.007000,
	0.007100,
	0.007100,
	0.007000,
	0.007800,
	0.009100,
	0.007300,
	0.007600,
	0.007200,
	0.008400,
	0.008200,
	0.007100,
	0.007300,
	0.007000,
	0.007200,
	0.007200,
	0.007100,
	0.007300,
	0.009200,
	0.007200,
	0.007600,
	0.007500,
	0.008100,
	0.007200,
	0.007100,
	0.006900,
	0.006800,
	0.006800,
	0.006500,
	0.006600,
	0.008800,
	0.008500,
	0.006900,
	0.006900,
	0.007800,
	0.007500,
	0.007000,
	0.007400,
	0.006600,
	0.009000,
	0.015300,
	0.008500,
	0.009000,
	0.008300,
	0.008500,
	0.007800,
	0.007800,
	0.007400,
	0.007200,
	0.007200,
	0.007100,
	0.007200,
	0.007400,
	0.007000,
	0.007300,
	0.008500,
	0.008400,
	0.007600,
	0.006900,
	0.007600,
	0.007300,
	0.007500,
	0.006700,
	0.007400,
	0.007400,
	0.007100,
	0.007200,
	0.009600,
	0.009200,
	0.008500,
	0.007700,
	0.007900,
	0.007000,
	0.007700,
	0.007000,
	0.007000,
	0.006600,
	0.007600,
	0.007300,
	0.009600,
	0.008000,
	0.008800,
	0.008200,
	0.007900,
	0.008200,
	0.008900,
	0.014700,
	0.008700,
	0.008400,
	0.006800,
	0.007000,
	0.009400,
	0.009100,
	0.007300,
	0.006800,
	0.007300,
	0.007200,
	0.006900,
	0.006700,
	0.008300,
	0.014300,
	0.008300,
	0.007900,
	0.008900,
	0.008700,
	0.008600,
	0.008000,
	0.007600,
	0.007400,
	0.007300,
	0.007300,
	0.007100,
	0.010200,
	0.007000,
	0.007300,
	0.006900,
	0.008800,
	0.008600,
	0.007900,
	0.007100,
	0.007300,
	0.007700,
	0.006900,
	0.006800,
	0.007600,
	0.007100,
	0.006600,
	0.006600,
	0.007800,
	0.009900,
	0.007200,
	0.006800,
	0.007200,
	0.007600,
	0.006500,
	0.006600,
	0.007300,
	0.006700,
	0.006900,
	0.006700,
	0.007100,
	0.008000,
	0.008700,
	0.007600,
	0.006900,
	0.007800,
	0.007300,
	0.007200,
	0.006800,
	0.007500,
	0.006600,
	0.007100,
	0.006500,
	0.006600,
	0.008300,
	0.008800,
	0.009000,
	0.007400,
	0.007200,
	0.007300,
	0.006900,
	0.007900,
	0.007600,
	0.007200,
	0.006900,
	0.006700,
	0.006400,
	0.007700,
	0.008900,
	0.008400,
	0.009200,
	0.008300,
	0.007000,
	0.007100,
	0.007000,
	0.006700,
	0.006800,
	0.007100,
	0.006700,
	0.007400,
	0.012600,
	0.009200,
	0.007300,
	0.007400,
	0.007400,
	0.007000,
	0.007600,
	0.007200,
	0.006800,
	0.006900,
	0.006700,
	0.007100,
	0.006700,
	0.009200,
	0.008300,
	0.008100,
	0.007500,
	0.007200,
	0.007200,
	0.007300,
	0.007600,
	0.007000,
	0.008300,
	0.007500,
	0.006800,
	0.008000,
	0.008700,
	0.008300,
	0.006800,
	0.007200,
	0.007500,
	0.007200,
	0.007300,
	0.006900,
	0.006700,
	0.008000,
	0.007200,
	0.007900,
	0.009000,
	0.008000,
	0.006900,
	0.007400,
	0.007500,
	0.007000,
	0.007300,
	0.007100,
	0.006900,
	0.006700,
	0.007300,
	0.008100,
	0.009400,
	0.008200,
	0.007500,
	0.007600,
	0.006600,
	0.007900,
	0.006900,
	0.006500,
	0.006500,
	0.006600,
	0.006500,
	0.008900,
	0.008000,
	0.009400,
	0.007600,
	0.008200,
	0.008000,
	0.006900,
	0.006600,
	0.007400,
	0.006600,
	0.006700,
	0.006600,
	0.006500,
	0.007000,
	0.009000,
	0.008200,
	0.008100,
	0.007400,
	0.006800,
	0.006500,
	0.006800,
	0.007500,
	0.006700,
	0.007100,
	0.006700,
	0.006800,
	0.006600,
	0.008500,
	0.009300,
	0.007900,
	0.008300,
	0.008000,
	0.008000,
	0.006700,
	0.007100,
	0.007300,
	0.007300,
	0.006700,
	0.007100,
	0.009700,
	0.009300,
	0.007000,
	0.007200,
	0.008200,
	0.006600,
	0.006600,
	0.006500,
	0.006700,
	0.006700,
	0.007100,
	0.008300,
	0.007300,
	0.008500,
	0.009000,
	0.009000,
	0.007200,
	0.007300,
	0.006700,
	0.007200,
	0.006600,
	0.006900,
	0.007000,
	0.006800,
	0.006700,
	0.007100,
	0.009600,
	0.008900,
	0.007500,
	0.007600,
	0.007000,
	0.006800,
	0.006700,
	0.006700,
	0.006800,
	0.006900,
	0.007000,
	0.007100,
	0.008300,
	0.009100,
	0.007200,
	0.008100,
	0.007100,
	0.007000,
	0.007300,
	0.006800,
	0.006600,
	0.006700,
	]
OPAQUE_gpu = [
	0.000000,
	0.000000,
	1.622016,
	1.631232,
	1.614848,
	1.617920,
	2.241536,
	2.173952,
	2.200576,
	2.173952,
	2.191360,
	2.210816,
	2.208768,
	2.586624,
	2.237440,
	2.500608,
	2.215936,
	2.105344,
	2.071552,
	2.000896,
	2.007040,
	1.957888,
	1.979392,
	1.903616,
	1.931264,
	1.908736,
	1.973248,
	1.930240,
	1.980416,
	1.951744,
	1.995776,
	1.977344,
	2.004992,
	1.964032,
	1.857536,
	1.913856,
	1.957888,
	1.906688,
	1.944576,
	1.886208,
	1.930240,
	1.854464,
	1.892352,
	1.825792,
	1.854464,
	1.802240,
	1.360896,
	1.798144,
	1.827840,
	1.778688,
	1.851392,
	1.788928,
	1.824768,
	1.775616,
	1.779712,
	1.725440,
	1.786880,
	1.727488,
	1.800192,
	1.747968,
	1.789952,
	1.802240,
	1.788928,
	1.756160,
	1.784832,
	1.799168,
	1.667072,
	1.770496,
	1.701888,
	1.693696,
	1.691648,
	1.685504,
	1.871872,
	1.824768,
	1.859584,
	1.850368,
	1.837056,
	1.827840,
	1.814528,
	1.816576,
	1.841152,
	1.820672,
	1.698816,
	1.844224,
	1.774592,
	1.830912,
	1.314816,
	1.738752,
	1.801216,
	1.687552,
	1.799168,
	1.712128,
	1.686528,
	1.829888,
	1.711104,
	1.849344,
	1.712128,
	1.707008,
	1.715200,
	1.727488,
	1.755136,
	1.797120,
	1.704960,
	1.679360,
	1.692672,
	1.736704,
	1.685504,
	1.739776,
	1.266688,
	1.636352,
	1.681408,
	1.760256,
	1.665024,
	1.765376,
	1.821696,
	1.742848,
	1.797120,
	1.753088,
	1.816576,
	1.751040,
	1.778688,
	1.737728,
	1.796096,
	1.723392,
	1.222656,
	1.723392,
	1.800192,
	1.767424,
	1.783808,
	1.743872,
	1.753088,
	1.737728,
	1.753088,
	1.737728,
	1.763328,
	1.703936,
	1.713152,
	1.611776,
	1.195008,
	1.698816,
	1.166336,
	1.670144,
	1.716224,
	1.673216,
	1.715200,
	1.640448,
	1.627136,
	1.641472,
	1.685504,
	1.563648,
	1.526784,
	1.588224,
	1.120256,
	1.574912,
	1.120256,
	1.557504,
	1.641472,
	1.531904,
	1.581056,
	1.512448,
	1.625088,
	1.078272,
	1.052672,
	1.463296,
	1.523712,
	1.463296,
	1.516544,
	1.531904,
	1.567744,
	1.510400,
	1.544192,
	1.498112,
	1.541120,
	1.484800,
	1.551360,
	1.442816,
	1.391616,
	1.430528,
	0.989184,
	1.419264,
	0.974848,
	1.481728,
	1.452032,
	1.476608,
	1.432576,
	1.382400,
	1.410048,
	1.413120,
	1.440768,
	1.219584,
	0.878592,
	1.371136,
	1.399808,
	1.288192,
	0.839680,
	1.271808,
	1.367040,
	1.254400,
	1.350656,
	1.245184,
	1.274880,
	1.216512,
	1.111040,
	1.208320,
	1.240064,
	1.230848,
	1.268736,
	1.212416,
	1.253376,
	1.201152,
	1.233920,
	1.177600,
	1.213440,
	1.205248,
	1.073152,
	1.154048,
	1.191936,
	1.136640,
	1.166336,
	1.137664,
	1.193984,
	1.148928,
	1.164288,
	1.145856,
	0.675840,
	1.113088,
	1.008640,
	1.180672,
	0.709632,
	1.189888,
	0.707584,
	1.183744,
	1.223680,
	1.167360,
	1.196032,
	1.080320,
	1.116160,
	1.075200,
	1.107968,
	0.975872,
	0.866304,
	1.021952,
	1.119232,
	1.040384,
	0.583680,
	1.118208,
	1.164288,
	1.105920,
	1.185792,
	1.270784,
	1.295360,
	1.247232,
	1.136640,
	1.255424,
	1.324032,
	1.285120,
	1.319936,
	1.249280,
	1.333248,
	1.292288,
	1.349632,
	1.321984,
	1.374208,
	1.289216,
	0.826368,
	1.299456,
	0.826368,
	1.341440,
	0.863232,
	1.378304,
	0.874496,
	1.389568,
	0.899072,
	1.409024,
	1.451008,
	1.271808,
	1.275904,
	1.366016,
	1.442816,
	1.437696,
	1.446912,
	1.393664,
	1.515520,
	1.432576,
	0.934912,
	1.444864,
	0.945152,
	1.400832,
	1.324032,
	1.489920,
	1.518592,
	1.443840,
	1.558528,
	1.453056,
	1.516544,
	1.452032,
	1.503232,
	1.541120,
	1.523712,
	1.545216,
	1.045504,
	1.611776,
	1.424384,
	1.533952,
	1.055744,
	1.533952,
	1.540096,
	1.499136,
	1.542144,
	1.509376,
	1.556480,
	1.562624,
	1.063936,
	1.410048,
	1.073152,
	1.552384,
	1.580032,
	1.560576,
	1.614848,
	1.596416,
	1.662976,
	1.638400,
	1.710080,
	1.673216,
	1.710080,
	1.672192,
	1.616896,
	1.722368,
	1.748992,
	1.692672,
	1.755136,
	1.718272,
	1.765376,
	1.704960,
	1.771520,
	1.727488,
	1.756160,
	1.726464,
	1.745920,
	1.714176,
	1.630208,
	1.724416,
	1.794048,
	1.764352,
	1.836032,
	1.734656,
	1.827840,
	1.732608,
	1.804288,
	1.768448,
	1.761280,
	1.770496,
	1.761280,
	1.630208,
	1.659904,
	1.776640,
	1.821696,
	1.793024,
	1.915904,
	1.901568,
	1.913856,
	1.862656,
	1.906688,
	1.826816,
	1.769472,
	1.597440,
	1.717248,
	1.698816,
	1.717248,
	1.705984,
	1.789952,
	1.845248,
	1.965056,
	1.963008,
	2.123776,
	2.116608,
	2.535424,
	2.470912,
	2.167808,
	2.334720,
	2.537472,
	2.541568,
	2.599936,
	2.508800,
	2.558976,
	2.490368,
	2.295808,
	2.577408,
	2.624512,
	2.581504,
	2.311168,
	2.463744,
	2.621440,
	2.607104,
	2.289664,
	2.609152,
	2.709504,
	2.569216,
	2.593792,
	2.567168,
	2.215936,
	2.537472,
	2.209792,
	1.924096,
	2.058240,
	1.976320,
	1.975296,
	1.954816,
	1.931264,
	1.897472,
	1.961984,
	1.932288,
	1.981440,
	1.947648,
	1.861632,
	1.992704,
	2.011136,
	1.966080,
	1.976320,
	1.930240,
	1.950720,
	1.913856,
	1.955840,
	1.884160,
	1.924096,
	1.867776,
	1.891328,
	1.712128,
	1.736704,
	1.807360,
	1.855488,
	1.805312,
	1.822720,
	1.804288,
	1.856512,
	1.803264,
	1.842176,
	1.768448,
	1.835008,
	1.637376,
	1.807360,
	1.634304,
	1.794048,
	1.772544,
	1.814528,
	1.740800,
	1.802240,
	1.779712,
	1.840128,
	1.753088,
	1.790976,
	1.758208,
	1.814528,
	1.680384,
	1.703936,
	1.798144,
	1.852416,
	1.856512,
	1.845248,
	1.790976,
	1.874944,
	1.773568,
	1.856512,
	1.833984,
	1.739776,
	1.732608,
	1.881088,
	1.807360,
	1.875968,
	1.802240,
	1.854464,
	1.771520,
	1.797120,
	1.826816,
	1.838080,
	1.820672,
	1.891328,
	1.844224,
	1.762304,
	1.828864,
	1.889280,
	1.805312,
	1.870848,
	1.827840,
	1.868800,
	1.803264,
	1.817600,
	1.772544,
	1.812480,
	1.765376,
	1.266688,
	1.757184,
	1.650688,
	1.736704,
	1.803264,
	1.743872,
	1.809408,
	1.748992,
	1.832960,
	1.772544,
	1.801216,
	1.763328,
	1.242112,
	1.647616,
	1.775616,
	1.756160,
	1.793024,
	1.744896,
	1.778688,
	1.734656,
	1.806336,
	1.748992,
	]
# OPAQUE:
#	CPU TIME:	0.008029, 512
#	GPU TIME:	1.661709, 512

# plt.plot(Scene_Render_cpu, label="Scene Render CPU")
plt.plot(Scene_Render_gpu, label="Scene Render GPU")
# plt.plot(OPAQUE_cpu, label="Opaque Render CPU")
plt.plot(OPAQUE_gpu, label="Opaque Render GPU")
# plt.plot(Clustered_cpu, label="Clustered Shading CPU")
plt.plot(Clustered_gpu, label="Clustered Shading GPU")
plt.legend()
plt.xlabel("Frame")
plt.ylabel("ms")
plt.title(label="Forward Clustered Pipeline")
plt.show()
