import { supabase, ensureAuth, getCurrentUserId } from './supabaseClient.js';

(function () {
      // ---------- DATA ----------------------------------------------------
      var PLAYER_COLORS = ["#f97316", "#22c55e", "#38bdf8", "#e879f9"];
      var START_SALARY = 200000;
      var ISLAND_TURNS = 3;
      var START_MONEY_3P = 3000000;
      var START_MONEY_2P = 6000000;

      // Official-ish tile data (simplified, see explanation in chat)
      var TILE_DEFS = {
        start: { id: "start", name: "출발", type: "start" },

        taipei: {
          id: "taipei",
          name: "타이베이",
          type: "city",
          landPrice: 50000,
          villaCost: 50000,
          buildingCost: 150000,
          hotelCost: 250000,
          tollLand: 2000,
          tollVilla: 10000,
          tollBuilding: 90000,
          tollHotel: 250000,
        },
        beijing: {
          id: "beijing",
          name: "베이징",
          type: "city",
          landPrice: 80000,
          villaCost: 50000,
          buildingCost: 150000,
          hotelCost: 250000,
          tollLand: 4000,
          tollVilla: 20000,
          tollBuilding: 180000,
          tollHotel: 450000,
        },
        manila: {
          id: "manila",
          name: "마닐라",
          type: "city",
          landPrice: 80000,
          villaCost: 50000,
          buildingCost: 150000,
          hotelCost: 250000,
          tollLand: 4000,
          tollVilla: 20000,
          tollBuilding: 180000,
          tollHotel: 450000,
        },
        jeju: {
          id: "jeju",
          name: "제주도",
          type: "vehicle",
          landPrice: 200000,
          tollLand: 300000,
        },
        singapore: {
          id: "singapore",
          name: "싱가포르",
          type: "city",
          landPrice: 100000,
          villaCost: 50000,
          buildingCost: 150000,
          hotelCost: 250000,
          tollLand: 6000,
          tollVilla: 30000,
          tollBuilding: 270000,
          tollHotel: 550000,
        },
        cairo: {
          id: "cairo",
          name: "카이로",
          type: "city",
          landPrice: 100000,
          villaCost: 50000,
          buildingCost: 150000,
          hotelCost: 250000,
          tollLand: 6000,
          tollVilla: 30000,
          tollBuilding: 270000,
          tollHotel: 550000,
        },
        istanbul: {
          id: "istanbul",
          name: "이스탄불",
          type: "city",
          landPrice: 120000,
          villaCost: 50000,
          buildingCost: 150000,
          hotelCost: 250000,
          tollLand: 8000,
          tollVilla: 40000,
          tollBuilding: 300000,
          tollHotel: 600000,
        },

        island: {
          id: "island",
          name: "무인도",
          type: "island",
        },

        athens: {
          id: "athens",
          name: "아테네",
          type: "city",
          landPrice: 140000,
          villaCost: 100000,
          buildingCost: 300000,
          hotelCost: 500000,
          tollLand: 10000,
          tollVilla: 50000,
          tollBuilding: 450000,
          tollHotel: 750000,
        },
        copenhagen: {
          id: "copenhagen",
          name: "코펜하겐",
          type: "city",
          landPrice: 160000,
          villaCost: 100000,
          buildingCost: 300000,
          hotelCost: 500000,
          tollLand: 12000,
          tollVilla: 60000,
          tollBuilding: 500000,
          tollHotel: 900000,
        },
        stockholm: {
          id: "stockholm",
          name: "스톡홀름",
          type: "city",
          landPrice: 160000,
          villaCost: 100000,
          buildingCost: 300000,
          hotelCost: 500000,
          tollLand: 12000,
          tollVilla: 60000,
          tollBuilding: 500000,
          tollHotel: 900000,
        },
        concorde: {
          id: "concorde",
          name: "콩코드 여객기",
          type: "vehicle",
          landPrice: 200000,
          tollLand: 300000,
        },
        bern: {
          id: "bern",
          name: "베른",
          type: "city",
          landPrice: 180000,
          villaCost: 100000,
          buildingCost: 300000,
          hotelCost: 500000,
          tollLand: 14000,
          tollVilla: 70000,
          tollBuilding: 550000,
          tollHotel: 950000,
        },
        berlin: {
          id: "berlin",
          name: "베를린",
          type: "city",
          landPrice: 180000,
          villaCost: 100000,
          buildingCost: 300000,
          hotelCost: 500000,
          tollLand: 14000,
          tollVilla: 70000,
          tollBuilding: 550000,
          tollHotel: 950000,
        },
        ottawa: {
          id: "ottawa",
          name: "오타와",
          type: "city",
          landPrice: 200000,
          villaCost: 100000,
          buildingCost: 300000,
          hotelCost: 500000,
          tollLand: 16000,
          tollVilla: 80000,
          tollBuilding: 600000,
          tollHotel: 1000000,
        },

        welfare: {
          id: "welfare",
          name: "사회복지기금 접수처",
          type: "welfare",
        },

        donate: {
            id: "donate",
            name: "사회복지기금 기부",
            type: "donate"
        },


        buenos_aires: {
          id: "buenos_aires",
          name: "부에노스아이레스",
          type: "city",
          landPrice: 220000,
          villaCost: 150000,
          buildingCost: 400000,
          hotelCost: 750000,
          tollLand: 18000,
          tollVilla: 90000,
          tollBuilding: 700000,
          tollHotel: 1050000,
        },
        sao_paulo: {
          id: "sao_paulo",
          name: "상파울루",
          type: "city",
          landPrice: 240000,
          villaCost: 150000,
          buildingCost: 450000,
          hotelCost: 750000,
          tollLand: 20000,
          tollVilla: 100000,
          tollBuilding: 750000,
          tollHotel: 1100000,
        },
        sydney: {
          id: "sydney",
          name: "시드니",
          type: "city",
          landPrice: 240000,
          villaCost: 150000,
          buildingCost: 450000,
          hotelCost: 750000,
          tollLand: 20000,
          tollVilla: 100000,
          tollBuilding: 750000,
          tollHotel: 1100000,
        },
        busan: {
          id: "busan",
          name: "부산",
          type: "vehicle",
          landPrice: 500000,
          tollLand: 600000,
        },
        hawaii: {
          id: "hawaii",
          name: "하와이",
          type: "city",
          landPrice: 260000,
          villaCost: 150000,
          buildingCost: 450000,
          hotelCost: 750000,
          tollLand: 22000,
          tollVilla: 110000,
          tollBuilding: 800000,
          tollHotel: 1150000,
        },
        lisbon: {
          id: "lisbon",
          name: "리스본",
          type: "city",
          landPrice: 260000,
          villaCost: 150000,
          buildingCost: 450000,
          hotelCost: 750000,
          tollLand: 22000,
          tollVilla: 110000,
          tollBuilding: 800000,
          tollHotel: 1150000,
        },
        queen_elizabeth: {
          id: "queen_elizabeth",
          name: "퀸 엘리자베스 호",
          type: "vehicle",
          landPrice: 300000,
          tollLand: 250000,
        },
        madrid: {
          id: "madrid",
          name: "마드리드",
          type: "city",
          landPrice: 280000,
          villaCost: 150000,
          buildingCost: 450000,
          hotelCost: 750000,
          tollLand: 24000,
          tollVilla: 120000,
          tollBuilding: 850000,
          tollHotel: 1200000,
        },

        space_travel: {
          id: "space_travel",
          name: "우주여행",
          type: "space",
        },

        tokyo: {
          id: "tokyo",
          name: "도쿄",
          type: "city",
          landPrice: 300000,
          villaCost: 200000,
          buildingCost: 600000,
          hotelCost: 1000000,
          tollLand: 26000,
          tollVilla: 130000,
          tollBuilding: 900000,
          tollHotel: 1270000,
        },
        columbia: {
          id: "columbia",
          name: "컬럼비아호",
          type: "vehicle",
          landPrice: 450000,
          tollLand: 300000,
        },
        paris: {
          id: "paris",
          name: "파리",
          type: "city",
          landPrice: 320000,
          villaCost: 200000,
          buildingCost: 600000,
          hotelCost: 1000000,
          tollLand: 28000,
          tollVilla: 150000,
          tollBuilding: 1000000,
          tollHotel: 1400000,
        },
        rome: {
          id: "rome",
          name: "로마",
          type: "city",
          landPrice: 320000,
          villaCost: 200000,
          buildingCost: 600000,
          hotelCost: 1000000,
          tollLand: 28000,
          tollVilla: 150000,
          tollBuilding: 1000000,
          tollHotel: 1400000,
        },
        london: {
          id: "london",
          name: "런던",
          type: "city",
          landPrice: 350000,
          villaCost: 200000,
          buildingCost: 600000,
          hotelCost: 1000000,
          tollLand: 35000,
          tollVilla: 170000,
          tollBuilding: 1100000,
          tollHotel: 1500000,
        },
        newyork: {
          id: "newyork",
          name: "뉴욕",
          type: "city",
          landPrice: 350000,
          villaCost: 200000,
          buildingCost: 600000,
          hotelCost: 1000000,
          tollLand: 35000,
          tollVilla: 170000,
          tollBuilding: 1100000,
          tollHotel: 1500000,
        },
        seoul: {
          id: "seoul",
          name: "서울",
          type: "vehicle", // 건물 불가 고가 땅
          landPrice: 1000000,
          tollLand: 2000000,
        },

        golden: {
          id: "golden",
          name: "황금열쇠",
          type: "golden",
        },
      };

      // Board path: 32 tiles around a 9x9 edge (clockwise).
      // We don't try to replicate real physical order perfectly; it's a reasonable loop.
      const BOARD_TEMPLATE = [
        "start", // 0 (corner)
        "taipei",
        "beijing",
        "manila",
        "jeju",
        "singapore",
        "cairo",
        "istanbul",
        "island", // 8 (corner)
        "athens",
        "copenhagen",
        "stockholm",
        "concorde",
        "bern",
        "berlin",
        "ottawa",
        "island", // 16 (corner)
        "buenos_aires",
        "sao_paulo",
        "sydney",
        "busan",
        "hawaii",
        "lisbon",
        "madrid",
        "island", // 24 (corner)
        "tokyo",
        "columbia",
        "paris",
        "rome",
        "london",
        "newyork",
        "seoul",
      ];

      var BOARD_PATH_IDS = BOARD_TEMPLATE.slice();
      var BOARD_LEN = BOARD_PATH_IDS.length; // 32

      function boardTile(i) {
        var id = BOARD_PATH_IDS[i];
        var tpl = TILE_DEFS[id];
        // shallow clone so we can attach runtime stuff if needed
        var t = {};
        for (var k in tpl) t[k] = tpl[k];
        t.boardIndex = i;
        return t;
      }

      function indexToRowCol(idx) {
        // 9x9 ring; indices 0-31 clockwise starting top-left corner
        var size = 9;
        if (idx < size) return { r: 0, c: idx }; // top row 0..8
        if (idx < size + (size - 2))
          return { r: idx - (size - 1), c: size - 1 }; // right col 9..15
        if (idx < size + (size - 2) + size)
          return {
            r: size - 1,
            c: size - 1 - (idx - (size + (size - 2))),
          }; // bottom row 16..24
        // left col 25..31
        return {
          r: size - 1 - (idx - (size + (size - 2) + size)),
          c: 0,
        };
      }

      function rowColToIndex(r, c) {
        var size = 9;
        if (r === 0) return c;
        if (c === size - 1) return size - 1 + r;
        if (r === size - 1)
          return size - 1 + (size - 1) + (size - 1 - c);
        if (c === 0)
          return (
            size - 1 + (size - 1) + size - 1 + (size - 1 - r)
          );
        return -1;
      }

      function formatMoney(n) {
        var s = n.toString();
        var sign = "";
        if (n < 0) {
          sign = "-";
          s = (-n).toString();
        }
        var out = "";
        while (s.length > 3) {
          out = "," + s.slice(-3) + out;
          s = s.slice(0, -3);
        }
        out = s + out;
        return sign + out + "원";
      }

      function colorWithAlpha(hex, alpha) {
        if (!hex) return "rgba(255, 255, 255, " + alpha + ")";
        var value = hex.replace("#", "");
        if (value.length === 3) {
          value =
            value[0] +
            value[0] +
            value[1] +
            value[1] +
            value[2] +
            value[2];
        }
        var r = parseInt(value.slice(0, 2), 16);
        var g = parseInt(value.slice(2, 4), 16);
        var b = parseInt(value.slice(4, 6), 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
          return "rgba(255, 255, 255, " + alpha + ")";
        }
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
      }

      function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
        }
        return arr;
      }

      function isFixedTileId(id) {
        return id === "start" || id === "island";
      }

      function policyTileValue(id) {
        var def = TILE_DEFS[id] || {};
        return def.landPrice || def.tollLand || 0;
      }

      function buildBoardForPolicy(policy) {
        var movable = [];
        for (var i = 0; i < BOARD_TEMPLATE.length; i++) {
          if (!isFixedTileId(BOARD_TEMPLATE[i])) movable.push(BOARD_TEMPLATE[i]);
        }

        var arranged;
        var mode = policy || "vanilla";
        if (mode === "random") {
          arranged = shuffle(movable.slice());
        } else if (mode === "reversed") {
          arranged = movable.slice().reverse();
        } else if (mode === "luxury") {
          arranged = movable
            .slice()
            .sort(function (a, b) {
              var diff = policyTileValue(b) - policyTileValue(a);
              if (diff !== 0) return diff;
              return a.localeCompare(b);
            });
        } else {
          arranged = movable.slice();
        }

        var next = [];
        var cursor = 0;
        for (var j = 0; j < BOARD_TEMPLATE.length; j++) {
          if (isFixedTileId(BOARD_TEMPLATE[j])) {
            next.push(BOARD_TEMPLATE[j]);
          } else {
            next.push(arranged[cursor++] || BOARD_TEMPLATE[j]);
          }
        }
        return next;
      }

      function applyBoardPolicy(policy) {
        var layout = buildBoardForPolicy(policy);
        setBoardLayout(layout);
        if (gameState) {
          gameState.boardPolicy = policy;
          gameState.boardLayout = layout.slice();
        }
        return layout;
      }

      function setBoardLayout(layout) {
        BOARD_PATH_IDS = layout.slice();
        BOARD_LEN = BOARD_PATH_IDS.length;
      }

      function syncBoardFromState(nextState) {
        if (!nextState) return;
        if (nextState.boardLayout && nextState.boardLayout.length) {
          setBoardLayout(nextState.boardLayout);
        } else if (nextState.boardPolicy) {
          var layout = buildBoardForPolicy(nextState.boardPolicy);
          nextState.boardLayout = layout.slice();
        } else {
          setBoardLayout(BOARD_TEMPLATE.slice());
        }
      }

      function serializeStateForStorage(targetState) {
        var snapshot = JSON.parse(
          JSON.stringify(targetState || gameState || {})
        );
        snapshot.boardLayout = BOARD_PATH_IDS.slice();
        snapshot.boardPolicy = snapshot.boardPolicy || gameState.boardPolicy;
        return snapshot;
      }

      function normalizeStatePayload(payload) {
        if (!payload) return payload;
        if (typeof payload === "string") {
          try {
            return JSON.parse(payload);
          } catch (err) {
            console.error("JSON parse error", err);
            return null;
          }
        }
        return payload;
      }

      // ---------- Golden Key ---------------------------------------------
      var GOLDEN_DECK_TEMPLATE = [
        {
          id: "move_jeju",
          kind: "move_to",
          targetId: "jeju",
          text: "관광여행: 제주도로 가시오.",
          salary: true,
        },
        {
          id: "move_busan",
          kind: "move_to",
          targetId: "busan",
          text: "관광여행: 부산으로 가시오.",
          salary: true,
        },
        {
          id: "move_seoul",
          kind: "move_to",
          targetId: "seoul",
          text: "관광여행: 서울로 가시오.",
          salary: false, // 출발 바로 뒤라 월급 없음
        },
        {
          id: "move_island",
          kind: "move_to",
          targetId: "island",
          text: "폭풍우를 만나 무인도로 가시오.",
          salary: false,
        },
        {
          id: "move_welfare",
          kind: "move_to",
          targetId: "welfare",
          text: "사회복지기금 배당: 사회복지기금 접수처로 가시오.",
          salary: true,
          welfarePayout: true,
        },
        {
          id: "highway",
          kind: "move_to",
          targetId: "start",
          text: "고속도로: 출발지로 가시오.",
          salary: true,
        },
        {
          id: "back2",
          kind: "move_back",
          steps: 2,
          text: "뒤로 두 칸 가시오.",
        },
        {
          id: "back3",
          kind: "move_back",
          steps: 3,
          text: "뒤로 세 칸 가시오.",
        },
        {
          id: "nobel",
          kind: "cash",
          amount: 300000,
          text: "노벨평화상 수상: 상금 30만을 받으시오.",
        },
        {
          id: "lottery",
          kind: "cash",
          amount: 200000,
          text: "복권 당첨: 20만을 받으시오.",
        },
        {
          id: "car_race",
          kind: "cash",
          amount: 100000,
          text: "자동차 경주 우승: 상금 10만을 받으시오.",
        },
        {
          id: "scholarship",
          kind: "cash",
          amount: 100000,
          text: "장학금 혜택: 10만을 받으시오.",
        },
        {
          id: "pension",
          kind: "cash",
          amount: 50000,
          text: "연금 혜택: 5만을 받으시오.",
        },
        {
          id: "overseas_study",
          kind: "fine",
          amount: 100000,
          toWelfare: false,
          text: "해외 유학: 10만을 지불하시오.",
        },
        {
          id: "hospital",
          kind: "fine",
          amount: 50000,
          toWelfare: false,
          text: "병원비: 5만을 지불하시오.",
        },
        {
          id: "speeding",
          kind: "fine",
          amount: 50000,
          toWelfare: true,
          text: "과속운전 벌금: 5만을 기부칸에 지불하시오.",
        },
        {
          id: "half_sale",
          kind: "half_sale",
          text: "반액대매출: 가장 비싼 땅과 건물을 반값에 매각하시오.",
        },
        {
          id: "maintenance_tax",
          kind: "maintenance",
          text: "정기종합소득세: 호텔 15만, 빌딩 10만, 별장 3만씩 지불.",
          perVilla: 30000,
          perBuilding: 100000,
          perHotel: 150000,
        },
        {
          id: "free_pass",
          kind: "free_pass",
          text: "우대권: 1회 통행료 면제권을 얻는다.",
        },
        {
          id: "island_escape",
          kind: "island_escape",
          text: "무인도 탈출권(무전기): 무인도에서 자유롭게 탈출할 수 있다.",
        },
      ];

      // ---------- STATE ---------------------------------------------------
      var gameState = {
        players: [],
        currentTurn: 0,
        hasRolled: false,
        extraRolls: 0,
        lastRoll: [null, null, null],
        welfareFund: 0,
        gameOver: false,
        turnCounter: 1,
        goldenDeck: [],
        tileDetailIndex: null,
        lastArrivalIndex: null,
        boardPolicy: "vanilla",
        boardLayout: BOARD_TEMPLATE.slice(),
      };
      var isOnlineMode = false;
      var currentRoom = null;
      var currentPlayerRow = null;
      var roomChannel = null;
      var playersChannel = null;
      var onlinePlayers = [];
      var currentUserId = null;

      // ---------- DOM refs -----------------------------------------------
      var elSetup = document.getElementById("ba-setup");
      var elGame = document.getElementById("ba-game");
      var elPlayerCount = document.getElementById("ba-player-count");
      var elTilePolicy = document.getElementById("ba-tile-policy");
      var elStartBtn = document.getElementById("ba-start-btn");
      var elResetBtn = document.getElementById("ba-reset-btn");

      var elBoardGrid = document.getElementById("ba-board-grid");
      var elTurnTitle = document.getElementById("ba-turn-title");
      var elCurrentTile = document.getElementById("ba-current-tile");
      var elTurnSub = document.getElementById("ba-turn-sub");
      var elTurnIndicator = document.getElementById("ba-turn-indicator");
      var elTurnIndicatorDot = document.getElementById("ba-turn-indicator-dot");
      var elTurnIndicatorName = document.getElementById(
        "ba-turn-indicator-name"
      );
      var elWelfare = document.getElementById("ba-welfare");
      var elMessage = document.getElementById("ba-message");

      var elDie1 = document.getElementById("ba-die-1");
      var elDie2 = document.getElementById("ba-die-2");
      var elDieSum = document.getElementById("ba-die-sum");

      var elRollBtn = document.getElementById("ba-roll-btn");
      var elActionBtn = document.getElementById("ba-action-btn");
      var elEndTurnBtn = document.getElementById("ba-endturn-btn");
      var elInGameResetBtn = document.getElementById("ba-reset-game-btn");

      var elSpaceRow = document.getElementById("ba-space-row");
      var elSpaceSelect = document.getElementById("ba-space-select");
      var elSpaceGoBtn = document.getElementById("ba-space-go-btn");

      var elPlayers = document.getElementById("ba-players");
      var elLog = document.getElementById("ba-log");
      var elLobbyCode = document.getElementById("ba-lobby-code");
      var elOnlineName = document.getElementById("ba-online-name");
      var elCreateRoomBtn = document.getElementById("ba-create-room");
      var elJoinRoomBtn = document.getElementById("ba-join-room");
      var elOnlineStatus = document.getElementById("ba-online-status");
      var elOnlineRoster = document.getElementById("ba-online-roster");

      // ▼ 타일 상세 패널 요소
      var elTileDetail = document.getElementById("ba-tile-detail");
      var elTileDetailTitle = document.getElementById("ba-tile-detail-title");
      var elTileDetailBody = document.getElementById("ba-tile-detail-body");
      var elTileDetailActions = document.getElementById(
        "ba-tile-detail-actions"
      );
      var elTileDetailMessage = document.getElementById(
        "ba-tile-detail-message"
      );
      var elTileDetailClose = document.getElementById("ba-tile-detail-close");

      function setOnlineStatus(message, isError) {
        if (!elOnlineStatus) return;
        elOnlineStatus.textContent = message || "";
        elOnlineStatus.style.color = isError ? "#f87171" : "#9ca3af";
      }

      var RLS_HELPERS = {
        rooms:
          "rooms 테이블에 INSERT 정책이 없어서 거부되었습니다. Supabase SQL Editor에서 아래 구문을 실행하고, 이미 동일한 이름의 정책이 있다면 DROP 후 다시 생성하세요:\n" +
          "ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;\n" +
          "DROP POLICY IF EXISTS rooms_insert_authenticated ON public.rooms;\n" +
          "CREATE POLICY rooms_insert_authenticated ON public.rooms\n" +
          "FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);",
        players:
          "players 테이블에 대한 RLS 정책을 추가/갱신해야 합니다. SQL Editor에서 다음 명령을 실행하세요:\n" +
          "ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;\n" +
          "DROP POLICY IF EXISTS players_self_access ON public.players;\n" +
          "CREATE POLICY players_self_access ON public.players\n" +
          "FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());",
      };

      function formatSupabaseError(err, fallback) {
        if (!err) return fallback || "알 수 없는 오류";
        var message = err.message || "";
        if (err.code === "anon-disabled") {
          return (
            "Anonymous Sign-ins가 비활성화되어 있습니다. Supabase Authentication > Providers > Anonymous에서" +
            " Anonymous Sign-ins를 켜 주세요."
          );
        }
        if (/row-level security/i.test(message) || /permission denied/i.test(message)) {
          if (message.includes('"rooms"')) {
            return RLS_HELPERS.rooms;
          }
          if (message.includes('"players"')) {
            return RLS_HELPERS.players;
          }
          return (
            "Row Level Security 정책으로 인해 거부되었습니다. rooms/players 테이블에 " +
            "authenticated 사용자를 위한 INSERT/SELECT 정책을 추가하세요."
          );
        }
        return message || fallback || "알 수 없는 오류";
      }

      function renderOnlineRoster() {
        if (!elOnlineRoster) return;
        elOnlineRoster.innerHTML = "";
        if (!onlinePlayers.length) {
          var empty = document.createElement("div");
          empty.className = "ba-note";
          empty.textContent = "참가자 없음";
          elOnlineRoster.appendChild(empty);
          return;
        }
        onlinePlayers.forEach(function (p) {
          var row = document.createElement("div");
          row.className = "ba-player-row";
          var name = document.createElement("div");
          name.className = "ba-player-name";
          name.textContent = p.name + (p.user_id === getCurrentUserId() ? " (나)" : "");
          row.appendChild(name);
          var stats = document.createElement("div");
          stats.className = "ba-player-status";
          stats.textContent =
            "현금 " + formatMoney(p.cash || 0) + " / 위치 #" + (p.position || 0);
          row.appendChild(stats);
          elOnlineRoster.appendChild(row);
        });
      }

      function tilePolicyLabel(policy) {
        if (!elTilePolicy) return policy || "";
        for (var i = 0; i < elTilePolicy.options.length; i++) {
          if (elTilePolicy.options[i].value === policy)
            return elTilePolicy.options[i].textContent;
        }
        return policy || "";
      }

    function showGoldenKeyPopup(text, callback) {
        var popup = document.getElementById("ba-golden-popup");
        var txt = document.getElementById("ba-golden-text");
        var btn = document.getElementById("ba-golden-continue");

        txt.textContent = text;

        popup.style.display = "flex";

        btn.onclick = function () {
            popup.style.display = "none";
            if (callback) callback();
        };
    }

      // ---------- Helpers for gameState --------------------------------------
      function currentPlayer() {
        return gameState.players[gameState.currentTurn];
      }

      function tileAt(index) {
        return boardTile(index);
      }

      function ownerOfTile(index) {
        for (var i = 0; i < gameState.players.length; i++) {
          var candidate = gameState.players[i];
          if (!candidate.bankrupt && playerOwnsTile(candidate, index)) {
            return candidate;
          }
        }
        return null;
      }

      function tileById(id) {
        return TILE_DEFS[id];
      }

      function playerOwnsTile(player, tileIndex) {
        return player.properties.hasOwnProperty(tileIndex);
      }

      function propertyLevel(player, tileIndex) {
        return player.properties[tileIndex] || 0;
      }

      function setPropertyLevel(player, tileIndex, level) {
        // level < 0 인 경우만 소유권 삭제
        if (level < 0) {
            delete player.properties[tileIndex];
        } else {
            player.properties[tileIndex] = level; // 0도 유효한 소유 상태
        }
    }


      function nextAlivePlayerIndex(fromIndex) {
        var len = gameState.players.length;
        for (var step = 1; step <= len; step++) {
          var idx = (fromIndex + step) % len;
          if (!gameState.players[idx].bankrupt) return idx;
        }
        return fromIndex;
      }

      function logEvent(player, text, delta) {
        var div = document.createElement("div");
        div.className = "ba-log-entry";

        var spanTurn = document.createElement("span");
        spanTurn.className = "turn";
        spanTurn.textContent = "[" + gameState.turnCounter + "]";
        div.appendChild(spanTurn);

        if (player) {
          var spanName = document.createElement("span");
          spanName.className = "name";
          spanName.textContent = player.name + ":";
          div.appendChild(spanName);
        }

        var spanText = document.createElement("span");
        spanText.textContent = " " + text;
        div.appendChild(spanText);

        if (typeof delta === "number" && delta !== 0) {
          var spanMoney = document.createElement("span");
          spanMoney.className =
            delta > 0 ? "money-pos" : "money-neg";
          spanMoney.textContent =
            " (" + (delta > 0 ? "+" : "") + formatMoney(delta) + ")";
          div.appendChild(spanMoney);
        }

        elLog.appendChild(div);
        elLog.scrollTop = elLog.scrollHeight;
      }

      function checkGameOver() {
        var alive = gameState.players.filter(function (p) {
          return !p.bankrupt;
        });
        if (!gameState.gameOver && alive.length === 1) {
          gameState.gameOver = true;
          elMessage.textContent =
            "게임 종료! 우승자는 " + alive[0].name + "님입니다 🎉";
          elTurnTitle.textContent = "우승: " + alive[0].name;
          logEvent(alive[0], "게임 승리!", 0);
        }
      }

      // ---------- Golden Key logic ---------------------------------------
      function createGoldenDeck() {
        return shuffle(
          GOLDEN_DECK_TEMPLATE.map(function (c) {
            return Object.assign({}, c);
          })
        );
      }

      function initGoldenDeck(targetState) {
        var target = targetState || gameState;
        if (!target) return;
        target.goldenDeck = createGoldenDeck();
      }

      function drawGoldenCard(targetState) {
        var target = targetState || gameState;
        if (!target.goldenDeck || target.goldenDeck.length === 0) {
          initGoldenDeck(target);
        }
        return target.goldenDeck.shift();
      }

      function applyGoldenCard(player, card) {
        logEvent(player, "황금열쇠: " + card.text, 0);

        switch (card.kind) {
          case "cash":
            player.money += card.amount;
            logEvent(
              player,
              "상금 획득",
              card.amount
            );
            break;

          case "fine":
            var amt = card.amount;
            if (card.toWelfare) {
              gameState.welfareFund += amt;
              logEvent(
                player,
                "벌금/기부로 복지기금 적립",
                -amt
              );
            }
            player.money -= amt;
            if (!card.toWelfare) {
              logEvent(
                player,
                "벌금 지불",
                -amt
              );
            }
            if (player.money < 0) {
              player.bankrupt = true;
              player.money = 0;
              logEvent(player, "자금 부족으로 파산", 0);
            }
            break;

          case "move_to":
            var targetIdx = BOARD_PATH_IDS.findIndex(function (id) {
              return id === card.targetId;
            });
            if (targetIdx >= 0) {
              movePlayerTo(player, targetIdx, {
                allowSalary: card.salary,
                fromGolden: true,
              });
              if (card.welfarePayout) {
                if (gameState.welfareFund > 0) {
                  player.money += gameState.welfareFund;
                  logEvent(
                    player,
                    "사회복지기금 배당 수령",
                    gameState.welfareFund
                  );
                  gameState.welfareFund = 0;
                }
              }
            }
            break;

          case "move_back":
            var idx = player.position;
            var target = (idx - card.steps) % BOARD_LEN;
            if (target < 0) target += BOARD_LEN;
            movePlayerTo(player, target, {
              allowSalary: false,
              fromGolden: true,
            });
            break;

          case "half_sale":
            doHalfSale(player);
            break;

          case "maintenance":
            payMaintenance(player, card);
            break;

          case "free_pass":
            player.freePass += 1;
            logEvent(
              player,
              "우대권 1장 획득 (보유: " + player.freePass + "장)",
              0
            );
            break;

          case "island_escape":
            player.islandEscape += 1;
            logEvent(
              player,
              "무인도 탈출권 1장 획득 (보유: " +
                player.islandEscape +
                "장)",
              0
            );
            break;
        }
      }

      function payMaintenance(player, card) {
        var villas = 0,
          buildings = 0,
          hotels = 0;
        for (var key in player.properties) {
          var lvl = player.properties[key];
          if (lvl === 1) villas++;
          else if (lvl === 2) buildings++;
          else if (lvl === 3) hotels++;
        }
        var total =
          villas * (card.perVilla || 0) +
          buildings * (card.perBuilding || 0) +
          hotels * (card.perHotel || 0);
        if (total > 0) {
          player.money -= total;
          gameState.welfareFund += total; // 세금은 복지기금으로
          logEvent(
            player,
            "건물 유지비/세금 지불",
            -total
          );
          if (player.money < 0) {
            player.bankrupt = true;
            player.money = 0;
            logEvent(player, "자금 부족으로 파산", 0);
          }
        }
      }

      function propertyTotalCost(player, tileIndex) {
        var idx = tileIndex;
        var id = BOARD_PATH_IDS[idx];
        var t = tileById(id);
        var lvl = propertyLevel(player, idx);
        var total = t.landPrice || 0;
        if (lvl >= 1) total += t.villaCost || 0;
        if (lvl >= 2) total += t.buildingCost || 0;
        if (lvl >= 3) total += t.hotelCost || 0;
        return total;
      }

      function doHalfSale(player) {
        var bestIdx = null;
        var bestValue = 0;
        for (var idx in player.properties) {
          var val = propertyTotalCost(player, parseInt(idx, 10));
          if (val > bestValue) {
            bestValue = val;
            bestIdx = parseInt(idx, 10);
          }
        }
        if (bestIdx === null) {
          logEvent(player, "반액대매출: 소유한 땅이 없습니다.", 0);
          return;
        }
        var gain = Math.floor(bestValue / 2);
        player.money += gain;
        delete player.properties[bestIdx];
        logEvent(
          player,
          "반액대매출: #" +
            bestIdx +
            " " +
            tileAt(bestIdx).name +
            " 매각",
          gain
        );
      }

      // ---------- Movement & tile effects --------------------------------
      function passStartFromTo(oldIndex, newIndex) {
        // moving forward; detect wrap
        var diff = (newIndex - oldIndex + BOARD_LEN) % BOARD_LEN;
        return diff > 0 && oldIndex + diff >= BOARD_LEN;
      }

      function movePlayerSteps(player, steps, options) {
        options = options || {};
        var old = player.position;
        var target = (old + steps) % BOARD_LEN;
        var passed = old + steps >= BOARD_LEN;
        movePlayerTo(player, target, {
          allowSalary: options.allowSalary !== false && passed,
          fromGolden: !!options.fromGolden,
        });
      }

      function movePlayerTo(player, targetIndex, options) {
        options = options || {};
        var old = player.position;
        var passed =
          options.fromGolden && options.allowSalary
            ? passStartFromTo(old, targetIndex)
            : options.allowSalary;
        if (passed) {
          player.money += START_SALARY;
          logEvent(player, "출발 통과 보너스 획득", START_SALARY);
        }

        player.position = targetIndex;
        gameState.lastArrivalIndex = targetIndex;
        handleLanding(player, tileAt(targetIndex));
      }

      function handleLanding(player, tile) {
        if (gameState.gameOver || player.bankrupt) 
        {
            return;
        }

        if (tile.type === "start") {
          logEvent(player, "출발 칸에 도착", 0);
        } else if (tile.type === "city" || tile.type === "vehicle") {
          var owner = null;
          var idx = tile.boardIndex;
          for (var i = 0; i < gameState.players.length; i++) {
            var p = gameState.players[i];
            if (!p.bankrupt && playerOwnsTile(p, idx)) {
              owner = p;
              break;
            }
          }
          if (!owner) {
            logEvent(
              player,
              tile.name + " 도시에 도착 (미소유)",
              0
            );
          } else if (owner === player) {
            logEvent(
              player,
              tile.name + " (내 땅)에 도착",
              0
            );
          } else {
            var rent = computeRent(owner, idx);
            if (rent > 0) {
              // 우대권 자동 사용
              if (player.freePass > 0) {
                logEvent(
                  player,
                  "우대권 사용으로 통행료 면제 (" +
                    tile.name +
                    ")",
                  0
                );
                player.freePass -= 1;
              } else {
                player.money -= rent;
                owner.money += rent;
                logEvent(
                  player,
                  tile.name +
                    " 통행료 지불 → " +
                    owner.name,
                  -rent
                );
                logEvent(
                  owner,
                  tile.name + " 통행료 수입",
                  rent
                );
                if (player.money < 0) {
                  player.bankrupt = true;
                  player.money = 0;
                  logEvent(
                    player,
                    "자금 부족으로 파산",
                    0
                  );
                }
              }
            }
          }
        } else if (tile.type === "island") {
          if (player.islandEscape > 0) {
            // 자동 사용은 하지 않고, 다음 턴에 사용하도록 할 수도 있지만 단순화
            player.islandEscape -= 1;
            logEvent(
              player,
              "무인도 도착, 탈출권 사용으로 즉시 탈출",
              0
            );
          } else {
            player.islandTurnsLeft = ISLAND_TURNS;
            logEvent(
              player,
              "무인도 도착: " + ISLAND_TURNS + "턴 휴식",
              0
            );
          }
        } else if (tile.type === "welfare") {
          if (gameState.welfareFund > 0) {
            player.money += gameState.welfareFund;
            logEvent(
              player,
              "사회복지기금 " +
                formatMoney(gameState.welfareFund) +
                " 수령",
              gameState.welfareFund
            );
            gameState.welfareFund = 0;
          } else if (tile.type === "donate") {
            var amt = tile.donateAmount || 50000;

            player.money -= amt;
            gameState.welfareFund += amt;

            logEvent(
            player,
            "사회복지기금 기부: " + formatMoney(amt) + " 적립",
            -amt
            );

            if (player.money < 0) {
                player.bankrupt = true;
                player.money = 0;
                logEvent(player, "자금 부족으로 파산", 0);
            }
        } else {
            logEvent(
              player,
              "사회복지기금: 적립된 금액이 없습니다.",
              0
            );
          }
        } else if (tile.type === "space") {
          player.spacePending = true;
          player.spaceFree = false;
          gameState.extraRolls = 0;
          logEvent(player, "우주여행 도착: 다음 턴에 목적지를 선택", 0);
        } else if (tile.type === "golden") {
          var card = drawGoldenCard();
          showGoldenKeyPopup(
            "황금열쇠!\n" + card.text,
            function () {
                // 기존 황금열쇠 후속 처리(기부, 이동, 벌금 등) 여기에
                applyGoldenCard(player, card);
            }
            );
        }
      }

      function computeRent(owner, tileIndex) {
        var id = BOARD_PATH_IDS[tileIndex];
        var t = tileById(id);
        if (t.type === "vehicle") return t.tollLand || 0;
        if (t.type !== "city") return 0;
        var level = propertyLevel(owner, tileIndex);
        if (level === 0) return t.tollLand || 0;
        if (level === 1) return t.tollVilla || t.tollLand || 0;
        if (level === 2) return t.tollBuilding || t.tollVilla || 0;
        if (level >= 3) return t.tollHotel || t.tollBuilding || 0;
        return 0;
      }

      // ---------- Rendering ----------------------------------------------
      function renderBoard() {
        elBoardGrid.innerHTML = "";
        var size = 9;

        var curr = currentPlayer();

        for (var r = 0; r < size; r++) {
          for (var c = 0; c < size; c++) {
            var idx = rowColToIndex(r, c);
            var div = document.createElement("div");

            if (idx === -1 || idx >= BOARD_LEN) {
              div.className = "ba-tile empty";
              elBoardGrid.appendChild(div);
              continue;
            }

            var tile = tileAt(idx);
            div.className = "ba-tile";
            if (tile.type === "start") div.className += " special";
            if (tile.type === "welfare") div.className += " special";
            if (tile.type === "donate") div.className += " donate";
            if (tile.type === "space") div.className += " special";
            if (tile.type === "golden") div.className += " golden";
            div.dataset.boardIndex = idx;

            var header = document.createElement("div");
            header.className = "ba-tile-header";

            var nameSpan = document.createElement("div");
            nameSpan.className = "ba-tile-name";
            nameSpan.textContent = tile.name;
            header.appendChild(nameSpan);

            var priceSpan = document.createElement("div");
            priceSpan.className = "ba-tile-price";

            if (tile.type === "city" || tile.type === "vehicle") {
              priceSpan.textContent = formatMoney(
                tile.landPrice || 0
              );
            } else if (tile.type === "start") {
              priceSpan.textContent = "+20만";
            } else if (tile.type === "welfare") {
              priceSpan.textContent = "적립 수령";
            } else if (tile.type === "golden") {
              priceSpan.textContent = "카드";
            } else if (tile.type === "space") {
              priceSpan.textContent = "목적지 선택";
            } else if (tile.type === "island") {
              priceSpan.textContent = "3턴 휴식";
            } else if (tile.type === "donate") {
                priceSpan.textContent = "-" + formatMoney(tile.donateAmount || 50000);
            }


            header.appendChild(priceSpan);
            div.appendChild(header);

            var ownerDiv = document.createElement("div");
            ownerDiv.className = "ba-tile-owner";

            var owner = null;
            if (tile.type === "city" || tile.type === "vehicle") {
              for (var i = 0; i < gameState.players.length; i++) {
                var p = gameState.players[i];
                if (!p.bankrupt && playerOwnsTile(p, idx)) {
                  owner = p;
                  break;
                }
              }
            }

            if (owner) {
              var lvl = propertyLevel(owner, idx);
              var lvlText =
                lvl === 0
                  ? ""
                  : lvl === 1
                  ? " · 별장"
                  : lvl === 2
                  ? " · 빌딩"
                  : " · 호텔";
              ownerDiv.textContent = "소유: " + owner.name + lvlText;
              div.className += " ba-tile-owned";
              var soft = colorWithAlpha(owner.color, 0.45);
              var tint = colorWithAlpha(owner.color, 0.2);
              div.style.setProperty("--ba-owner-color", owner.color);
              div.style.setProperty("--ba-owner-color-soft", soft);
              div.style.setProperty("--ba-owner-color-tint", tint);
              var badge = document.createElement("div");
              badge.className = "ba-tile-owner-badge";
              badge.style.background = owner.color;
              var badgeInitial = document.createElement("span");
              badgeInitial.className = "ba-tile-owner-initial";
              badgeInitial.textContent = owner.name.charAt(0);
              var badgeName = document.createElement("span");
              badgeName.className = "ba-tile-owner-name";
              badgeName.textContent = owner.name;
              badge.appendChild(badgeInitial);
              badge.appendChild(badgeName);
              div.appendChild(badge);
            } else if (tile.type === "city" || tile.type === "vehicle") {
              ownerDiv.textContent = "미소유";
            } else {
              ownerDiv.innerHTML = "&nbsp;";
            }

            div.appendChild(ownerDiv);

            var playersDiv = document.createElement("div");
            playersDiv.className = "ba-tile-players";

            gameState.players.forEach(function (p) {
              if (p.bankrupt) return;
              if (p.position === idx) {
                var tok = document.createElement("div");
                var tokenClass = "ba-token";
                if (curr && p === curr && !gameState.gameOver) {
                  tokenClass += " current";
                }
                tok.className = tokenClass;
                tok.style.background = p.color;
                tok.textContent = p.name.charAt(0);
                playersDiv.appendChild(tok);
              }
            });

            div.appendChild(playersDiv);

            var indexSpan = document.createElement("div");
            indexSpan.className = "ba-tile-index";
            indexSpan.textContent = "#" + idx;
            div.appendChild(indexSpan);

            if (
              curr &&
              curr.position === idx &&
              !gameState.gameOver
            ) {
              div.className += " ba-tile-current";
            }

            elBoardGrid.appendChild(div);
          }
        }
      }

      function renderPlayers() {
        elPlayers.innerHTML = "";
        gameState.players.forEach(function (p, idx) {
          var row = document.createElement("div");
          row.className = "ba-player-row";
          if (idx === gameState.currentTurn && !gameState.gameOver) {
            row.className += " ba-player-current";
          }

          var main = document.createElement("div");
          main.className = "ba-player-main";

          var colorDot = document.createElement("div");
          colorDot.className = "ba-player-color";
          colorDot.style.background = p.color;
          main.appendChild(colorDot);

          var nameSpan = document.createElement("div");
          nameSpan.className = "ba-player-name";
          nameSpan.textContent = p.name;
          main.appendChild(nameSpan);

          row.appendChild(main);

          var right = document.createElement("div");
          right.style.display = "flex";
          right.style.flexDirection = "column";
          right.style.alignItems = "flex-end";
          right.style.gap = "0.1rem";

          var moneySpan = document.createElement("div");
          moneySpan.className = "ba-player-money";
          moneySpan.textContent = formatMoney(p.money);
          right.appendChild(moneySpan);

          var statusSpan = document.createElement("div");
          statusSpan.className = "ba-player-status";

          if (p.bankrupt) {
            var pill = document.createElement("span");
            pill.className = "ba-pill broke";
            pill.textContent = "파산";
            statusSpan.appendChild(pill);
          } else {
            var pill1 = document.createElement("span");
            pill1.className = "ba-pill";
            pill1.textContent =
              "도시: " +
              Object.keys(p.properties).length +
              "개";
            statusSpan.appendChild(pill1);

            if (p.islandTurnsLeft > 0) {
              var pill2 = document.createElement("span");
              pill2.className = "ba-pill";
              pill2.textContent =
                "무인도 " + p.islandTurnsLeft + "턴";
              statusSpan.appendChild(pill2);
            }

            if (p.spacePending) {
              var pill3 = document.createElement("span");
              pill3.className = "ba-pill";
              pill3.textContent = "우주여행 준비";
              statusSpan.appendChild(pill3);
            }
          }

          right.appendChild(statusSpan);
          row.appendChild(right);
          elPlayers.appendChild(row);
        });
      }

      function renderTurnInfo() {
        var p = currentPlayer();
        if (!p) return;

        if (gameState.gameOver) {
          elTurnTitle.textContent = "게임 종료";
          if (elTurnIndicatorName && elTurnIndicatorDot && elTurnIndicator) {
            elTurnIndicatorName.textContent = "게임 종료";
            elTurnIndicatorDot.style.background = "#475569";
            elTurnIndicator.classList.add("ba-turn-indicator-ended");
          }
        } else {
          elTurnTitle.textContent = p.name + "님의 차례";
          if (elTurnIndicatorName && elTurnIndicatorDot && elTurnIndicator) {
            elTurnIndicatorName.textContent = p.name + "님의 차례";
            elTurnIndicatorDot.style.background = p.color;
            elTurnIndicator.classList.remove("ba-turn-indicator-ended");
          }
        }

        var tile = tileAt(p.position);
        elCurrentTile.textContent =
          "현재 위치: #" +
          p.position +
          " — " +
          tile.name +
          " (" +
          typeLabel(tile.type) +
          ")";

        var sub = [];
        if (p.islandTurnsLeft > 0) {
          sub.push("무인도에 갇힘 (남은 턴 " + p.islandTurnsLeft + ")");
        }
        if (p.spacePending) {
          sub.push("우주여행 준비 중: 목적지 선택 필요");
        }
        elTurnSub.textContent = sub.join(" · ") || "-";

        var d1 = gameState.lastRoll[0];
        var d2 = gameState.lastRoll[1];
        var sum = gameState.lastRoll[2];
        elDie1.textContent = d1 === null ? "-" : d1;
        elDie2.textContent = d2 === null ? "-" : d2;
        elDieSum.textContent = sum === null ? "-" : sum;

        elWelfare.textContent =
          "복지기금: " + formatMoney(gameState.welfareFund);

        // Buttons
        if (gameState.gameOver || p.bankrupt) {
          elRollBtn.disabled = true;
          if (elActionBtn) {
            elActionBtn.textContent = "타일 행동";
            elActionBtn.disabled = true;
          }
          elEndTurnBtn.disabled = true;
          elSpaceRow.style.display = "none";
          return;
        }

        if (elActionBtn) {
          var actionState = determineActionButtonState(p);
          elActionBtn.textContent = actionState.label;
          elActionBtn.disabled = actionState.disabled;
        }

        // 우주여행 선택 UI
        if (p.spacePending) {
          elSpaceRow.style.display = "flex";
          populateSpaceSelect(p);
        } else {
          elSpaceRow.style.display = "none";
        }

        // roll button
        if (p.spacePending) {
          elRollBtn.disabled = true;
        } else if (p.islandTurnsLeft > 0) {
          // 무인도: 탈출 시도는 항상 1번만
          elRollBtn.disabled = gameState.hasRolled;
        } else {
          elRollBtn.disabled =
            gameState.hasRolled && gameState.extraRolls <= 0;
        }

        // end turn
        elEndTurnBtn.disabled =
          !gameState.hasRolled || gameState.extraRolls > 0 || p.spacePending;
      }

      function typeLabel(type) {
        switch (type) {
          case "start":
            return "출발";
          case "city":
            return "도시";
          case "vehicle":
            return "탈것/특수";
          case "island":
            return "무인도";
          case "welfare":
            return "복지기금";
          case "space":
            return "우주여행";
          case "golden":
            return "황금열쇠";
        }
        return type;
      }

      function determineActionButtonState(player) {
        var defaultState = { label: "타일 행동", disabled: true };
        if (!player || gameState.gameOver || player.bankrupt) {
          return defaultState;
        }

        var boardIndex = player.position;
        var tile = tileAt(boardIndex);
        if (!tile) return defaultState;

        var owner = ownerOfTile(boardIndex);
        var justArrived = gameState.lastArrivalIndex === boardIndex;

        var canBuy =
          (tile.type === "city" || tile.type === "vehicle") &&
          tile.landPrice &&
          !owner &&
          justArrived &&
          player.money >= tile.landPrice;

        if (canBuy) {
          return { label: "타일 구매", disabled: false };
        }

        if (
          tile.type === "city" &&
          owner === player &&
          !gameState.hasRolled
        ) {
          var level = propertyLevel(player, boardIndex);
          if (level < 3) {
            var nextLevel = level + 1;
            var cost =
              nextLevel === 1
                ? tile.villaCost || 0
                : nextLevel === 2
                ? tile.buildingCost || 0
                : tile.hotelCost || 0;
            if (cost && player.money >= cost) {
              var label =
                nextLevel === 1
                  ? "별장"
                  : nextLevel === 2
                  ? "빌딩"
                  : "호텔";
              return { label: label + " 건설", disabled: false };
            }
          }
        }

        return defaultState;
      }
      
      function setTileDetailMessage(text) {
        if (!elTileDetailMessage) return;
        if (text) {
          elTileDetailMessage.textContent = text;
          elTileDetailMessage.classList.remove("ba-hidden");
        } else {
          elTileDetailMessage.textContent = "";
          elTileDetailMessage.classList.add("ba-hidden");
        }
      }

      function hideTileDetail() {
        if (!elTileDetail) return;
        gameState.tileDetailIndex = null;
        setTileDetailMessage("");
        elTileDetail.classList.add("ba-hidden");
      }

      function showTileDetail(boardIndex) {
        if (!elTileDetail) return;
        var tile = tileAt(boardIndex);
        if (!tile) return;

        elTileDetailTitle.textContent = tile.name || "타일 정보";

        // 소유자 / 건물 단계 계산
        var owner = ownerOfTile(boardIndex);

        var lvl = owner ? propertyLevel(owner, boardIndex) : 0;
        var lvlLabel =
          lvl === 0
            ? "없음"
            : lvl === 1
            ? "별장"
            : lvl === 2
            ? "빌딩"
            : "호텔";

        var typeText = typeLabel(tile.type);

        // 본문 HTML 구성 (타입에 따라 필요한 정보만)
        var html = "";

        html +=
          '<div class="ba-tile-detail-row">' +
          '<div class="ba-tile-detail-label">종류</div>' +
          '<div class="ba-tile-detail-value">' +
          typeText +
          "</div></div>";

        if (tile.type === "city" || tile.type === "vehicle") {
          html +=
            '<div class="ba-tile-detail-row">' +
            '<div class="ba-tile-detail-label">증서 가격</div>' +
            '<div class="ba-tile-detail-value">' +
            formatMoney(tile.landPrice || 0) +
            "</div></div>";
        }

        if (tile.type === "city") {
          if (tile.tollLand) {
            html +=
              '<div class="ba-tile-detail-row">' +
              '<div class="ba-tile-detail-label">기본 통행료</div>' +
              '<div class="ba-tile-detail-value">' +
              formatMoney(tile.tollLand) +
              "</div></div>";
          }
          if (tile.tollVilla) {
            html +=
              '<div class="ba-tile-detail-row">' +
              '<div class="ba-tile-detail-label">별장 통행료</div>' +
              '<div class="ba-tile-detail-value">' +
              formatMoney(tile.tollVilla) +
              "</div></div>";
          }
          if (tile.tollBuilding) {
            html +=
              '<div class="ba-tile-detail-row">' +
              '<div class="ba-tile-detail-label">빌딩 통행료</div>' +
              '<div class="ba-tile-detail-value">' +
              formatMoney(tile.tollBuilding) +
              "</div></div>";
          }
          if (tile.tollHotel) {
            html +=
              '<div class="ba-tile-detail-row">' +
              '<div class="ba-tile-detail-label">호텔 통행료</div>' +
              '<div class="ba-tile-detail-value">' +
              formatMoney(tile.tollHotel) +
              "</div></div>";
          }
        } else if (tile.type === "vehicle" && tile.tollLand) {
          html +=
            '<div class="ba-tile-detail-row">' +
            '<div class="ba-tile-detail-label">통행료</div>' +
            '<div class="ba-tile-detail-value">' +
            formatMoney(tile.tollLand) +
            "</div></div>";
        } else if (tile.type === "start") {
          html +=
            '<div class="ba-tile-detail-row">' +
            '<div class="ba-tile-detail-label">효과</div>' +
            '<div class="ba-tile-detail-value">지날 때마다 20만 획득</div></div>';
        } else if (tile.type === "island") {
          html +=
            '<div class="ba-tile-detail-row">' +
            '<div class="ba-tile-detail-label">효과</div>' +
            '<div class="ba-tile-detail-value">무인도에 ' +
            ISLAND_TURNS +
            "턴 동안 갇힘 (더블 시 탈출)</div></div>";
        } else if (tile.type === "welfare") {
          html +=
            '<div class="ba-tile-detail-row">' +
            '<div class="ba-tile-detail-label">효과</div>' +
            '<div class="ba-tile-detail-value">적립된 사회복지기금을 모두 가져감</div></div>';
        } else if (tile.type === "space") {
          html +=
            '<div class="ba-tile-detail-row">' +
            '<div class="ba-tile-detail-label">효과</div>' +
            '<div class="ba-tile-detail-value">다음 턴에 원하는 목적지로 이동</div></div>';
        } else if (tile.type === "golden") {
          html +=
            '<div class="ba-tile-detail-row">' +
            '<div class="ba-tile-detail-label">효과</div>' +
            '<div class="ba-tile-detail-value">황금열쇠 카드를 한 장 뽑음</div></div>';
        }

        html +=
          '<div class="ba-tile-detail-row">' +
          '<div class="ba-tile-detail-label">현재 소유자</div>' +
          '<div class="ba-tile-detail-value">' +
          (owner ? owner.name : "없음") +
          "</div></div>";

        if (tile.type === "city") {
          html +=
            '<div class="ba-tile-detail-row">' +
            '<div class="ba-tile-detail-label">건물 단계</div>' +
            '<div class="ba-tile-detail-value">' +
            lvlLabel +
            "</div></div>";
        }

        elTileDetailBody.innerHTML = html;
        gameState.tileDetailIndex = boardIndex;
        setTileDetailMessage("");
        renderTileDetailActions(boardIndex);
        elTileDetail.classList.remove("ba-hidden");
      }

      function renderTileDetailActions(boardIndex) {
        if (!elTileDetailActions) return;
        elTileDetailActions.innerHTML = "";

        var tile = tileAt(boardIndex);
        if (!tile) return;

        var p = currentPlayer();
        var helperTexts = [];
        var owner = ownerOfTile(boardIndex);

        var canAct = !!(p && !gameState.gameOver && !p.bankrupt);

        function appendHelper(text) {
          if (!text) return;
          helperTexts.push(text);
        }

        if (!canAct) {
          appendHelper("현재 플레이어가 행동할 수 없습니다.");
        } else {
          if (
            (tile.type === "city" || tile.type === "vehicle") &&
            !owner &&
            tile.landPrice
          ) {
            if (p.position !== boardIndex) {
              appendHelper("해당 타일에 서 있을 때만 증서를 구입할 수 있습니다.");
            } else if (!gameState.hasRolled) {
              appendHelper("주사위를 굴려 도착한 턴에만 증서를 구입할 수 있습니다.");
            } else {
              var buyBtn = document.createElement("button");
              buyBtn.type = "button";
              buyBtn.className = "ba-btn";
              buyBtn.dataset.action = "buy";
              buyBtn.dataset.index = boardIndex;
              buyBtn.textContent =
                "증서 구입 (" + formatMoney(tile.landPrice) + ")";
              if (p.money < tile.landPrice) {
                buyBtn.disabled = true;
                appendHelper(
                  "구입에는 " + formatMoney(tile.landPrice) + "이 필요합니다."
                );
              }
              elTileDetailActions.appendChild(buyBtn);
            }
          } else if (owner && owner !== p) {
            appendHelper(owner.name + "님이 이미 소유 중입니다.");
          }

          if (tile.type === "city" && owner === p) {
            var level = propertyLevel(p, boardIndex);
            if (level >= 3) {
              appendHelper("이미 호텔까지 건설했습니다.");
            } else if (gameState.hasRolled) {
              appendHelper("건물은 주사위를 굴리기 전에만 지을 수 있습니다.");
            } else {
              var nextLevel = level + 1;
              var cost =
                nextLevel === 1
                  ? tile.villaCost || 0
                  : nextLevel === 2
                  ? tile.buildingCost || 0
                  : tile.hotelCost || 0;
              var label =
                nextLevel === 1
                  ? "별장"
                  : nextLevel === 2
                  ? "빌딩"
                  : "호텔";
              var buildBtn = document.createElement("button");
              buildBtn.type = "button";
              buildBtn.className = "ba-btn";
              buildBtn.dataset.action = "build";
              buildBtn.dataset.index = boardIndex;
              buildBtn.textContent =
                label + " 건설 (" + formatMoney(cost || 0) + ")";
              if (!cost || p.money < cost) {
                buildBtn.disabled = true;
                appendHelper(
                  "건설에는 " + formatMoney(cost || 0) + "이 필요합니다."
                );
              }
              elTileDetailActions.appendChild(buildBtn);
            }
          }
        }

        if (elTileDetailActions.children.length === 0) {
          appendHelper("선택 가능한 행동이 없습니다.");
        }

        helperTexts.forEach(function (text) {
          var helper = document.createElement("div");
          helper.className = "ba-tile-detail-helper";
          helper.textContent = text;
          elTileDetailActions.appendChild(helper);
        });
      }

      // 닫기 이벤트
      if (elTileDetailClose) {
        elTileDetailClose.addEventListener("click", hideTileDetail);
      }
      if (elTileDetail) {
        elTileDetail.addEventListener("click", function (ev) {
          if (ev.target === elTileDetail) hideTileDetail();
        });
      }
      document.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape") hideTileDetail();
      });


      function populateSpaceSelect(player) {
        elSpaceSelect.innerHTML = "";
        BOARD_PATH_IDS.forEach(function (id, idx) {
          if (id === "space_travel") return;
          var opt = document.createElement("option");
          opt.value = idx;
          opt.textContent =
            "#" + idx + " " + tileById(id).name;
          elSpaceSelect.appendChild(opt);
        });
      }

      function renderAll() {
        renderBoard();
        renderPlayers();
        renderTurnInfo();
        if (
          elTileDetail &&
          !elTileDetail.classList.contains("ba-hidden") &&
          typeof gameState.tileDetailIndex === "number"
        ) {
          var existingMessage =
            elTileDetailMessage &&
            !elTileDetailMessage.classList.contains("ba-hidden")
              ? elTileDetailMessage.textContent
              : "";
          showTileDetail(gameState.tileDetailIndex);
          if (existingMessage) {
            setTileDetailMessage(existingMessage);
          }
        }
      }

      // ---------- Actions -------------------------------------------------
      function getSetupConfig() {
        var count = parseInt(elPlayerCount.value, 10);
        var names = [
          document.getElementById("ba-name-1").value || "플레이어 1",
          document.getElementById("ba-name-2").value || "플레이어 2",
          document.getElementById("ba-name-3").value || "플레이어 3",
          document.getElementById("ba-name-4").value || "플레이어 4",
        ];
        var policyValue = elTilePolicy ? elTilePolicy.value : "vanilla";
        return {
          playerCount: count,
          names: names.slice(0, count),
          policy: policyValue,
        };
      }

      function createStateFromConfig(config) {
        var layout = buildBoardForPolicy(config.policy || "vanilla");
        setBoardLayout(layout);
        var colorIdx = shuffle([0, 1, 2, 3]).slice(0, config.playerCount);
        var startMoney =
          config.playerCount === 2 ? START_MONEY_2P : START_MONEY_3P;
        var players = [];
        for (var i = 0; i < config.playerCount; i++) {
          players.push({
            name: config.names[i],
            color: PLAYER_COLORS[colorIdx[i]],
            position: 0,
            money: startMoney,
            properties: {},
            bankrupt: false,
            islandTurnsLeft: 0,
            spacePending: false,
            spaceFree: false,
            freePass: 0,
            islandEscape: 0,
          });
        }
        var nextState = {
          players: players,
          currentTurn: 0,
          hasRolled: false,
          extraRolls: 0,
          lastRoll: [null, null, null],
          welfareFund: 0,
          gameOver: false,
          turnCounter: 1,
          goldenDeck: createGoldenDeck(),
          tileDetailIndex: null,
          lastArrivalIndex: null,
          boardPolicy: config.policy,
          boardLayout: layout.slice(),
        };
        return nextState;
      }

      function loadGameState(nextState, options) {
        if (!nextState) return;
        options = options || {};
        gameState = nextState;
        syncBoardFromState(gameState);
        if (!gameState.goldenDeck) {
          initGoldenDeck(gameState);
        }
        if (!options.keepLog) {
          elLog.innerHTML = "";
        }
        renderAll();
      }

      function showGameScreen() {
        elSetup.style.display = "none";
        elGame.style.display = "block";
        elResetBtn.style.display = "inline-flex";
      }

      function startGame() {
        var config = getSetupConfig();
        var nextState = createStateFromConfig(config);
        loadGameState(nextState);
        showGameScreen();
        var policyLabel = tilePolicyLabel(config.policy);
        elMessage.textContent =
          "게임 시작! 타일 정책: " +
          (policyLabel || config.policy) +
          ". 첫 번째 플레이어가 주사위를 굴리세요.";
        logEvent(
          null,
          "타일 정책 적용: " + (policyLabel || config.policy),
          0
        );
      }

      function resetGame() {
        gameState.players = [];
        gameState.gameOver = false;
        gameState.tileDetailIndex = null;
        gameState.lastArrivalIndex = null;
        elGame.style.display = "none";
        elSetup.style.display = "block";
        elResetBtn.style.display = "none";
        elLog.innerHTML = "";
        hideTileDetail();
        isOnlineMode = false;
        currentRoom = null;
        currentPlayerRow = null;
        setOnlineStatus("", false);
        cleanupRealtime();
      }

      function rollDice() {
        var p = currentPlayer();
        if (!p || gameState.gameOver || p.bankrupt) 
        {
            endTurn();
            checkGameOver();
            return;
        }

        if (p.spacePending) return; // 우주여행 먼저 처리해야 함

        if (p.islandTurnsLeft > 0) {
          if (gameState.hasRolled) return;
          var d1 = randomDie();
          var d2 = randomDie();
          var sum = d1 + d2;
          gameState.lastRoll = [d1, d2, sum];
          gameState.hasRolled = true;
          gameState.extraRolls = 0;

          if (d1 === d2) {
            // 탈출 + 이동 (더블이지만 추가턴은 없음)
            p.islandTurnsLeft = 0;
            logEvent(
              p,
              "무인도에서 더블! 탈출 후 " +
                sum +
                "칸 이동.",
              0
            );
            movePlayerSteps(p, sum, {
              allowSalary: true,
            });
          } else {
            p.islandTurnsLeft -= 1;
            logEvent(
              p,
              "무인도 탈출 실패 (남은 턴 " +
                p.islandTurnsLeft +
                ")",
              0
            );
          }

          renderAll();
          checkGameOver();
          return;
        }

        if (gameState.hasRolled && gameState.extraRolls <= 0 || p.bankrupt) 
        {
            endTurn();
            checkGameOver();
            return;
        }

        var d1 = randomDie();
        var d2 = randomDie();
        var sum = d1 + d2;
        gameState.lastRoll = [d1, d2, sum];
        gameState.hasRolled = true;

        var isDouble = d1 === d2;

        logEvent(
          p,
          "주사위: " + d1 + " + " + d2 + " = " + sum,
          0
        );

        movePlayerSteps(p, sum, { allowSalary: true });

        // 더블이면 한 번 더 (우주여행/무인도 도착 등은 예외처럼 처리)
        if (isDouble && !p.spacePending && p.islandTurnsLeft <= 0) {
          gameState.extraRolls += 1;
          logEvent(
            p,
            "더블! 한 번 더 굴릴 수 있습니다.",
            0
          );
        } else {
          gameState.extraRolls = Math.max(gameState.extraRolls - 1, 0);
        }

        renderAll();
        if(p.bankrupt)
        {
            endTurn();
        }
        checkGameOver();
        notifyStateChanged();
      }

      function randomDie() {
        return Math.floor(Math.random() * 6) + 1;
      }

      function openCurrentTileDetail() {
        var p = currentPlayer();
        if (!p || gameState.gameOver) return;
        showTileDetail(p.position);
      }

      function attemptPurchase(boardIndex) {
        var p = currentPlayer();
        var tile = tileAt(boardIndex);
        if (!p || !tile || gameState.gameOver || p.bankrupt) return;
        if (tile.type !== "city" && tile.type !== "vehicle") return;

        if (p.position !== boardIndex) {
          setTileDetailMessage("해당 칸에 있을 때만 증서를 구입할 수 있습니다.");
          return;
        }
        if (gameState.lastArrivalIndex !== boardIndex) {
          setTileDetailMessage(
            "증서는 해당 칸에 도착한 직후에만 구입할 수 있습니다."
          );
          return;
        }

        var owner = ownerOfTile(boardIndex);
        if (owner) {
          setTileDetailMessage(owner.name + "님이 이미 소유 중입니다.");
          return;
        }

        var price = tile.landPrice || 0;
        if (price <= 0) return;
        if (p.money < price) {
          setTileDetailMessage(
            "구입에는 " + formatMoney(price) + "이 필요합니다."
          );
          return;
        }

        p.money -= price;
        setPropertyLevel(p, boardIndex, 0);
        logEvent(p, tile.name + " 증서 구입", -price);
        renderAll();
        showTileDetail(boardIndex);
        setTileDetailMessage(tile.name + " 증서를 구입했습니다!");
        elMessage.textContent = tile.name + " 증서를 구입했습니다.";
        notifyStateChanged();
      }

      function attemptBuild(boardIndex) {
        var p = currentPlayer();
        var tile = tileAt(boardIndex);
        if (!p || !tile || gameState.gameOver || p.bankrupt) return;
        if (tile.type !== "city") return;

        if (!playerOwnsTile(p, boardIndex)) {
          setTileDetailMessage("자신의 도시에서만 건설할 수 있습니다.");
          return;
        }
        if (gameState.hasRolled) {
          setTileDetailMessage("건물은 주사위를 굴리기 전에만 지을 수 있습니다.");
          return;
        }

        var level = propertyLevel(p, boardIndex);
        if (level >= 3) {
          setTileDetailMessage("이미 호텔까지 건설했습니다.");
          return;
        }

        var nextLevel = level + 1;
        var cost =
          nextLevel === 1
            ? tile.villaCost || 0
            : nextLevel === 2
            ? tile.buildingCost || 0
            : tile.hotelCost || 0;
        if (!cost || p.money < cost) {
          setTileDetailMessage(
            "건설에는 " + formatMoney(cost || 0) + "이 필요합니다."
          );
          return;
        }

        var label =
          nextLevel === 1
            ? "별장"
            : nextLevel === 2
            ? "빌딩"
            : "호텔";

        p.money -= cost;
        setPropertyLevel(p, boardIndex, nextLevel);
        logEvent(p, tile.name + "에 " + label + " 건설", -cost);
        renderAll();
        showTileDetail(boardIndex);
        setTileDetailMessage(tile.name + "에 " + label + "를 지었습니다!");
        elMessage.textContent = tile.name + "에 " + label + " 건설 완료";
        notifyStateChanged();
      }

      function endTurn() {
        var p = currentPlayer();
        if (!p || gameState.gameOver) return;
        if (!gameState.hasRolled || p.spacePending) return;
        gameState.hasRolled = false;
        gameState.extraRolls = 0;
        gameState.lastRoll = [null, null, null];
        gameState.lastArrivalIndex = null;
        gameState.turnCounter += 1;

        // 다음 플레이어
        gameState.currentTurn = nextAlivePlayerIndex(
          gameState.currentTurn
        );
        renderAll();
        elMessage.textContent = "";
        notifyStateChanged();
      }

      // Build buildings by clicking your own city before rolling
      function handleBoardClick(e) {
        var cell = e.target.closest(".ba-tile");
        if (!cell) return;
        var idxStr = cell.dataset.boardIndex;
        if (typeof idxStr === "undefined") return;

        var idx = parseInt(idxStr, 10);
        showTileDetail(idx);
      }

      function handleSpaceGo() {
        var p = currentPlayer();
        if (!p || !p.spacePending || gameState.gameOver) return;
        var targetIdx = parseInt(
          elSpaceSelect.value,
          10
        );
        if (
          isNaN(targetIdx) ||
          targetIdx < 0 ||
          targetIdx >= BOARD_LEN
        )
          return;

        // 비용 지불 (컬럼비아호 소유자)
        var colIdx = BOARD_PATH_IDS.findIndex(function (id) {
          return id === "columbia";
        });
        if (!p.spaceFree && colIdx >= 0) {
          var owner = ownerOfTile(colIdx);
          if (owner && owner !== p) {
            var fee = 200000;
            p.money -= fee;
            owner.money += fee;
            logEvent(
              p,
              "우주여행 이용료 지불 → " + owner.name,
              -fee
            );
            logEvent(
              owner,
              "우주여행 이용료 수입",
              fee
            );
            if (p.money < 0) {
              p.bankrupt = true;
              p.money = 0;
              logEvent(p, "자금 부족으로 파산", 0);
            }
          }
        }

        p.spacePending = false;
        p.spaceFree = false;

        movePlayerTo(p, targetIdx, {
          allowSalary: true,
          fromGolden: true,
        });

        renderAll();
        checkGameOver();
        notifyStateChanged();
      }

      // ---------- Supabase Multiplayer -----------------------------------
      async function createRoom(lobbyCode, playerName) {
        var code = (lobbyCode || "").trim().toUpperCase();
        var name = (playerName || "온라인 플레이어").trim();
        if (!code) {
          alert("로비 코드를 입력하세요.");
          return;
        }
        try {
          currentUserId = await ensureAuth();
        } catch (err) {
          console.error(err);
          var authMessage = formatSupabaseError(err, "Supabase 인증 실패");
          setOnlineStatus(authMessage, true);
          alert(authMessage);
          return;
        }
        await cleanupRealtime();
        setOnlineStatus("Supabase 방을 생성하는 중...", false);
        var config = getSetupConfig();
        var initialState = createStateFromConfig(config);
        try {
          var payload = serializeStateForStorage(initialState);
          const { data: roleData, error: roleError } = await supabase.rpc('get_my_role');
          console.log(roleData); // Should return { role: 'authenticated' } if signed in

          const { data: { user }, error: userError } = await supabase.auth.getUser();
          console.log(user); // Should show a user object with id, email, etc.; if null or error, you're not authenticated
          var roomResp = await supabase
            .from("rooms")
            .insert({ code: code, state: payload, created_by: currentUserId })  // Add created_by here
            .select()
            .single();
          if (roomResp.error) throw roomResp.error;
          var room = roomResp.data;
          var playerResp = await supabase
            .from("players")
            .insert({
              room_id: room.id,
              user_id: currentUserId,
              name: name,
              cash: initialState.players[0]?.money || 0,
              position: 0,
            })
            .select()
            .single();
          if (playerResp.error) throw playerResp.error;
          currentRoom = room;
          currentPlayerRow = playerResp.data;
          isOnlineMode = true;
          loadGameState(initialState);
          showGameScreen();
          setOnlineStatus("온라인 방이 생성되었습니다.", false);
          await subscribeToRoom(room.id);
        } catch (err) {
          console.error(err);
          var message = formatSupabaseError(err, "Supabase 방 생성 실패");
          alert("Supabase 방 생성 실패: " + message);
          setOnlineStatus("방 생성 실패: " + message, true);
        }
      }

      async function joinRoom(lobbyCode, playerName) {
        var code = (lobbyCode || "").trim().toUpperCase();
        var name = (playerName || "온라인 플레이어").trim();
        if (!code) {
          alert("로비 코드를 입력하세요.");
          return;
        }
        try {
          currentUserId = await ensureAuth();
        } catch (err) {
          console.error(err);
          var authMessage = formatSupabaseError(err, "Supabase 인증 실패");
          setOnlineStatus(authMessage, true);
          alert(authMessage);
          return;
        }
        await cleanupRealtime();
        setOnlineStatus("방 정보를 불러오는 중...", false);
        try {
          var roomResp = await supabase
            .from("rooms")
            .select("*")
            .eq("code", code)
            .single();
          if (roomResp.error) throw roomResp.error;
          var room = roomResp.data;
          var playerResp = await supabase
            .from("players")
            .select("*")
            .eq("room_id", room.id)
            .eq("user_id", currentUserId)
            .maybeSingle();
          if (playerResp.error) throw playerResp.error;
          var playerRow = playerResp.data;
          if (!playerRow) {
            var defaultCash =
              (room.state?.players && room.state.players[0]?.money) || 0;
          const { data: roleData, error: roleError } = await supabase.rpc('get_my_role');
          console.log(roleData); // Should return { role: 'authenticated' } if signed in

          const { data: { user }, error: userError } = await supabase.auth.getUser();
          console.log(user); // Should show a user object with id, email, etc.; if null or error, you're not authenticated
            var insertResp = await supabase
              .from("players")
              .insert({
                room_id: room.id,
                user_id: currentUserId,
                name: name,
                cash: defaultCash,
                position: 0,
              })
              .select()
              .single();
            if (insertResp.error) throw insertResp.error;
            playerRow = insertResp.data;
          }
          currentRoom = room;
          currentPlayerRow = playerRow;
          isOnlineMode = true;
          var remoteState = normalizeStatePayload(room.state);
          loadGameState(remoteState, { keepLog: true });
          showGameScreen();
          setOnlineStatus("온라인 방에 연결되었습니다.", false);
          await subscribeToRoom(room.id);
        } catch (err) {
          console.error(err);
          var message = formatSupabaseError(err, "방 참가 실패");
          alert("방 참가 실패: " + message);
          setOnlineStatus("방 참가 실패: " + message, true);
        }
      }

      async function cleanupRealtime() {
        if (roomChannel) {
          await supabase.removeChannel(roomChannel);
          roomChannel = null;
        }
        if (playersChannel) {
          await supabase.removeChannel(playersChannel);
          playersChannel = null;
        }
        onlinePlayers = [];
        renderOnlineRoster();
      }

      async function subscribeToRoom(roomId) {
        if (!roomId) return;
        roomChannel = supabase
          .channel("room-" + roomId)
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "rooms", filter: "id=eq." + roomId },
            function (payload) {
              if (payload.new && payload.new.state) {
                handleRemoteState(payload.new.state);
              }
            }
          )
          .subscribe();
        playersChannel = supabase
          .channel("players-" + roomId)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "players", filter: "room_id=eq." + roomId },
            function () {
              refreshPlayers(roomId);
            }
          )
          .subscribe();
        await refreshPlayers(roomId);
      }

      async function refreshPlayers(roomId) {
        if (!roomId) return;
        try {
          var resp = await supabase
            .from("players")
            .select("*")
            .eq("room_id", roomId)
            .order("created_at", { ascending: true });
          if (resp.error) throw resp.error;
          onlinePlayers = resp.data || [];
          renderOnlineRoster();
        } catch (err) {
          console.error("플레이어 목록 로드 실패", err);
        }
      }

      function handleRemoteState(newState) {
        var normalized = normalizeStatePayload(newState);
        if (!normalized) return;
        loadGameState(normalized, { keepLog: true });
        setOnlineStatus("원격 상태 동기화", false);
      }

      async function commitMove(patch) {
        if (patch) {
          loadGameState(patch, { keepLog: true });
        }
        if (!isOnlineMode || !currentRoom) {
          return;
        }
        try {
          var payload = serializeStateForStorage();
          var resp = await supabase
            .from("rooms")
            .update({ state: payload })
            .eq("id", currentRoom.id)
            .select()
            .single();
          if (resp.error) throw resp.error;
          currentRoom = resp.data;
        } catch (err) {
          console.error("상태 동기화 실패", err);
          setOnlineStatus("상태 동기화 실패", true);
        }
      }

      function notifyStateChanged() {
        if (!isOnlineMode) return;
        commitMove();
      }

      // ---------- Event binding ------------------------------------------
      elStartBtn.addEventListener("click", startGame);
      elResetBtn.addEventListener("click", resetGame);
      if (elInGameResetBtn) {
        elInGameResetBtn.addEventListener("click", resetGame);
      }
      elRollBtn.addEventListener("click", rollDice);
      if (elActionBtn) {
        elActionBtn.addEventListener("click", openCurrentTileDetail);
      }
      elEndTurnBtn.addEventListener("click", endTurn);
      elBoardGrid.addEventListener("click", handleBoardClick);
      elSpaceGoBtn.addEventListener("click", handleSpaceGo);
      if (elTileDetailActions) {
        elTileDetailActions.addEventListener("click", function (e) {
          var btn = e.target.closest("[data-action]");
          if (!btn) return;
          var idx = parseInt(btn.dataset.index, 10);
          if (btn.dataset.action === "buy") {
            attemptPurchase(idx);
          } else if (btn.dataset.action === "build") {
            attemptBuild(idx);
          }
        });
      }
      if (elCreateRoomBtn) {
        elCreateRoomBtn.addEventListener("click", function () {
          createRoom(elLobbyCode && elLobbyCode.value, elOnlineName && elOnlineName.value);
        });
      }
      if (elJoinRoomBtn) {
        elJoinRoomBtn.addEventListener("click", function () {
          joinRoom(elLobbyCode && elLobbyCode.value, elOnlineName && elOnlineName.value);
        });
      }

      window.createRoom = createRoom;
      window.joinRoom = joinRoom;
      window.commitMove = commitMove;
    })();
