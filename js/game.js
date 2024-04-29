// 游戏界面中英文切换
// 默认语言为英文
var isEnglish = true;

// 定义中英文文本，通过在texts对象中的键来查找元素
const texts = {
	english: {
		switchBtn: "Switch Language",
		title: "Chess",
		chooseTitle: "Chess: Please select a mode",
		authorTitle: "Author: lieren2023",
		PlayerVsAI: "▶ Player vs AI",
		PlayerwVsAIb: "Player with the White pieces",
		PlayerbVsAIw: "Player with the Black pieces",
		PlayerVsPlayer: "▶ Player vs Player",
		PlayerwVsPlayerb: "Player with the White pieces",
		PlayerbVsPlayerw: "Player with the Black pieces",
		AIVsAI: "▶ AI vs AI",
		AIwVsAIb: "AI with the White pieces",
		AIbVsAIw: "AI with the Black pieces",
		backToGameBtn: "Back to game",
		animationSpeedBtn: "Animation Speed: normal",
		AImoveSpeedBtn: "Move Speed: normal",
		randomMoveOpt: "Random move",
		AIMoveModeTitle: "AI Move mode:",
		rightConfigTitle: "Config",
		
		undoBtn: "Undo",
		redoBtn: "Redo",
		whiteOrientationBtn: "White Orientation",
		blackOrientationBtn: "Black Orientation",
		pieceThemeBtn: "Piece Theme: cburnett",
		boardThemeBtn: "Board Theme: brown",
		showNotationBtn: "Notation: show",
		notationPositionBtn: "Position: inner",
		clearBoardBtn: "Clear Board",
		startPositionBtn: "Start Position and Reset",
		returnToModeSelectionBtn: "Return to Mode Selection",
	},
	chinese: {
		switchBtn: "切换语言",
		title: "国际象棋",
		chooseTitle: "国际象棋：请选择模式",
		authorTitle: "作者：棘手怀念摧毁",
		PlayerVsAI: "▶ 人机对战",
		PlayerwVsAIb: "人机对战-玩家执白先行",
		PlayerbVsAIw: "人机对战-玩家执黑后行",
		PlayerVsPlayer: "▶ 人人对战",
		PlayerwVsPlayerb: "人人对战-玩家执白先行",
		PlayerbVsPlayerw: "人人对战-玩家执黑后行",
		AIVsAI: "▶ 机机对战",
		AIwVsAIb: "机机对战-AI执白先行",
		AIbVsAIw: "机机对战-AI执黑后行",
		backToGameBtn: "返回游戏界面",
		animationSpeedBtn: "动画速度：正常",
		AImoveSpeedBtn: "行棋速度：正常",
		randomMoveOpt: "随机移动模式",
		AIMoveModeTitle: "AI移动模式：",
		rightConfigTitle: "游戏设置",
		
		undoBtn: "悔棋",
		redoBtn: "恢复",
		whiteOrientationBtn: "白方视角",
		blackOrientationBtn: "黑方视角",
		pieceThemeBtn: "棋子样式：cburnett",
		boardThemeBtn: "棋盘样式：brown",
		showNotationBtn: "坐标显示：开启",
		notationPositionBtn: "坐标位置：内部",
		clearBoardBtn: "清空棋盘",
		startPositionBtn: "重新开始",
		returnToModeSelectionBtn: "返回模式选择界面",
	}
};

// 初始化页面文本
Object.keys(texts.english).forEach(key => {
	const element = document.getElementById(key);
	if (element) {
		element.textContent = isEnglish ? texts.english[key] : texts.chinese[key];
	}
});

// 切换语言函数
function toggleLanguage() {
	isEnglish = !isEnglish;
	const switchBtnElement = document.getElementById("switchBtn");
	switchBtnElement.textContent = isEnglish ? texts.english.switchBtn : texts.chinese.switchBtn;
	
	// 批量处理元素文本
	Object.keys(texts.english).forEach(key => {
		const element = document.getElementById(key);
		if (element) {
			element.textContent = isEnglish ? texts.english[key] : texts.chinese[key];
		}
	});
}


// 模式选择界面
// 可以引用 selectedMode 变量，根据不同模式进行判断
var selectedMode;

// 共用的游戏界面
var board = null;
var game = new Chess();
var whiteSquareGrey = '#a9a9a9';
var blackSquareGrey = '#696969';
var config = {
	// 暂不适配手机端
	// sparePieces: true,
	
	position: 'start',
	draggable: true,
	onDragStart: onDragStart,
	onDrop: onDrop,
	onMouseoutSquare: onMouseoutSquare,
	onMouseoverSquare: onMouseoverSquare,
	onSnapEnd: onSnapEnd,
	
	// fix: default piece theme is wikipedia
	// 修改存放图片文件夹名为image
	pieceTheme: 'image/chesspieces/cburnett/{piece}.png'
};
board = Chessboard('myBoard1', config);


// TODO
/*
// 暂不适配手机端，与坐标位置：外部冲突？
// 为了动画效果，sparePieces: true,，棋盘上下的sparePieces暂时先设置为透明
// 获取所有具有指定类名的元素
var elementsToTransparent = document.querySelectorAll('.spare-pieces-7492f.spare-pieces-bottom-ae20f, .spare-pieces-7492f.spare-pieces-top-4028b');
// 遍历元素并将它们设置为透明
for (var i = 0; i < elementsToTransparent.length; i++) {
	elementsToTransparent[i].style.opacity = '0';
}
*/


// 模式选择函数
function selectMode(mode) {
	selectedMode = mode;
	document.querySelector('.modeSelect').style.display = 'none';
	document.getElementById('commonchessboard').style.display = 'flex';
	
	board.clear();
	board.start();
	gamereset();
	
	// 人机对战-玩家执黑后行、人人对战-玩家执黑后行、机机对战-AI执黑后行
	if (selectedMode === 'PlayerbVsAIw' || selectedMode === 'PlayerbVsPlayerw' || selectedMode === 'AIbVsAIw') {
		boardorientationBlack();
	} else boardorientationWhite();
}

// 重置函数
function gamereset() {
	game.reset();
	updateStatus();
	btnDisabledFalse();
	
	isRunning = true;
	isFirstTime = true;
	
	// 人机对战-玩家执黑后行、机机对战-AI执白先行、机机对战-AI执黑后行
	if (selectedMode === 'PlayerbVsAIw' || selectedMode === 'AIwVsAIb' || selectedMode === 'AIbVsAIw') {
		setTimeoutMove();
	}
}

// 返回游戏界面按钮
function backToGame() {
	resumeMoveTimer();
	
	document.querySelector('.modeSelect').style.display = 'none';
	document.getElementById('commonchessboard').style.display = 'flex';
}

// 游戏初始化时返回游戏界面按钮不可用
document.getElementById('backToGameBtn').disabled = true;

// 返回模式选择界面按钮
function returnToModeSelection() {
	pauseMoveTimer();
	
	// 返回模式时返回游戏界面按钮可用
	document.getElementById('backToGameBtn').disabled = false;
	
	document.getElementById('commonchessboard').style.display = 'none';
	document.querySelector('.modeSelect').style.display = 'flex';
}

// selectMode时/gamereset时Undo和Redo按钮可用
function btnDisabledFalse() {
	document.getElementById('undoBtn').disabled = false;
	document.getElementById('redoBtn').disabled = false;
}
// 游戏结束后（胜利/失败/和棋）Undo和Redo按钮不可用
function btnDisabledTrue() {
	document.getElementById('undoBtn').disabled = true;
	document.getElementById('redoBtn').disabled = true;
}


var DEFAULT_normal_SPEED = 1600;
var DEFAULT_slow_SPEED = 2900;
var DEFAULT_fast_SPEED = 1000;
// 定义行棋速度
var moveSpeed = DEFAULT_normal_SPEED;
// 定义一个全局变量来存储定时器的引用
var moveTimer;
// 游戏状态变量（非游戏界面为false）
var isRunning = false;
// AI行棋函数
function movesPieces() {
	// 获取下拉菜单元素
	var selectElement = document.getElementById("AIMoveModeOptions");
	// 获取选中的选项的值
	var selectedValue = selectElement.value;
	
	// 使用if语句检查选项的值
	// if(selectedValue === "option1") {
		
	// }
	// else 
	if(selectedValue === "randommove") {
		// 随机移动模式[Random move]
		makeRandomMove();
	}
	// else if(selectedValue === "option3") {
		
	// }
	// else if(selectedValue === "option4") {
		
	// }
}
// 启动定时器
function setTimeoutMove() {
	// 每次启动任务前先清除之前的定时器
	clearTimeout(moveTimer);
	
	// 设置一个新的定时器
	moveTimer = setTimeout(movesPieces, moveSpeed); // 执行行棋任务
	isRunning = true;
}
// 暂停定时器
function pauseMoveTimer() {
	clearInterval(moveTimer);
	isRunning = false;
}
// 恢复定时器
function resumeMoveTimer() {
	updateStatus();
	
	if (!isRunning) {
		// 修复人机对战返回游戏界面后分不清谁在行棋的bug
		if ((game.turn() === 'w' && selectedMode === 'PlayerwVsAIb') || (game.turn() === 'b' && selectedMode === 'PlayerbVsAIw')) {
			isRunning = true;
			return;
		} else setTimeoutMove();
	}
}


var isFirstTime = true;
function updateStatus() {
	var status = '';
	
	var moveColor = 'White';
	if (game.turn() === 'b') {
		moveColor = 'Black';
	}
	
	// checkmate?
	if (game.in_checkmate()) {
		// 引入isFirstTime，临时修复可能弹窗两次的bug
		if (isFirstTime) {
			if (!isEnglish) {
				if (moveColor === 'Black') {
					alert('白方胜利！');
				} else {
					alert('黑方胜利！');
				}
			} else {
				if (moveColor === 'Black') {
					alert('White wins!');
				} else {
					alert('Black wins!');
				}
			}
			
			isFirstTime = false;
		}
		
		if (!isEnglish) {
			var transmoveColor = moveColor== 'Black' ? '黑方' : '白方';
			status = '游戏结束' + '<br>' + transmoveColor + '被“将死”！';
		} else {
			status = 'Game over.' + '<br>' + moveColor + ' is in checkmate!';
		}
		
		// 游戏结束后（胜利/失败/和棋）Undo和Redo按钮不可用
		btnDisabledTrue();
	}
	
	// draw?
	else if (game.in_draw()) {
		if (!isEnglish) {
			status = '游戏结束' + '<br>' + "双方和棋！";
		} else {
			status = 'Game over.' + '<br>' + "It's a draw!";
		}
		
		// 游戏结束后（胜利/失败/和棋）Undo和Redo按钮不可用
		btnDisabledTrue();
	}
	
	// game still on
	else {
		if (!isEnglish) {
			var transmoveColor = moveColor== 'Black' ? '黑方' : '白方';
			status = transmoveColor + "行棋" + '<br>' + '不处于被“将军”/“将死”/和棋状态';
			
			// check?
			if (game.in_check()) {
				status = transmoveColor + "行棋" + '<br>' + transmoveColor + '被“将军”！';
			}
		} else {
			status = moveColor + "'s turn." + '<br>' + 'No check, checkmate, or draw.';
			
			// check?
			if (game.in_check()) {
				status = moveColor + "'s turn." + '<br>' + moveColor + ' is in check!';
			}
		}
	}
	
	var statusp = document.getElementById('turn');
	statusp.innerHTML = status;
	
	// console.log('FEN:',game.fen());
	// console.log('PGN:',game.pgn());
	
}


// 音频播放函数
function playAudio(audioFile) {
	var audio = new Audio(audioFile);
	audio.play();
}
// Move or Capture audio
function playMoveAudio(move) {
	if (move.captured) {
		playAudio('audio/Capture.mp3');
	} else playAudio('audio/Move.mp3');
}




// Highlight Legal Moves
function removeGreySquares() {
	$('#myBoard1 .square-55d63').css('background', '');
}
function greySquare (square) {
	var $square = $('#myBoard1 .square-' + square);
	
	var background = whiteSquareGrey;
	if ($square.hasClass('black-3c85d')) {
		background = blackSquareGrey;
	}
	
	$square.css('background', background);
}

function onDragStart (source, piece, position, orientation) {
	// do not pick up pieces if the game is over
	if (game.game_over()) return false;
	
	// or if it's not that side's turn
	if ((game.turn() === 'w' && piece.search(/^b/) !== -1) || (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
		return false;
	}
	
	// console.log('Drag started:');
	// console.log('Source: ' + source);
	// console.log('Piece: ' + piece);
	// console.log('Position: ' + Chessboard.objToFen(position));
	// console.log('Orientation: ' + orientation);
	// console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
}

function onDrop (source, target, piece, newPos, oldPos, orientation) {
	removeGreySquares();
	
	// see if the move is legal
	var move = game.move({
		from: source,
		to: target,
		promotion: 'q' // NOTE: always promote to a queen for example simplicity
	});
	
	// illegal move
	if (move === null) return 'snapback';
	
	// Move or Capture audio
	playMoveAudio(move);
	
	updateStatus();
	
	// console.log('Source: ' + source);
	// console.log('Target: ' + target);
	// console.log('Piece: ' + piece);
	// console.log('New position: ' + Chessboard.objToFen(newPos));
	// console.log('Old position: ' + Chessboard.objToFen(oldPos));
	// console.log('Orientation: ' + orientation);
	// console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
	
	// 人机对战-玩家执白先行、人机对战-玩家执黑后行
	// make legal move for black/white
	if (selectedMode === 'PlayerwVsAIb' || selectedMode === 'PlayerbVsAIw') {
		setTimeoutMove();
	}
}

function onMouseoverSquare (square, piece) {
	// get list of possible moves for this square
	var moves = game.moves({
		square: square,
		verbose: true
	});
	
	// exit if there are no moves available for this square
	if (moves.length === 0) return;
	
	// highlight the square they moused over
	greySquare(square);
	
	// highlight the possible squares for this piece
	for (var i = 0; i < moves.length; i++) {
		greySquare(moves[i].to);
	}
}

function onMouseoutSquare (square, piece) {
	removeGreySquares();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
	board.position(game.fen());
}




var undo_stack = [];
var STACK_SIZE = 100; // maximum size of undo stack
function undo() {
	var move = game.undo();
	undo_stack.push(move);
	
	// Maintain a maximum stack size
	if (undo_stack.length > STACK_SIZE) {
		undo_stack.shift();
	}
	board.position(game.fen());
	updateStatus();
}
function boardUndo() {
	// 人人对战、机机对战，Undo once
	if (selectedMode === 'PlayerwVsPlayerb' || selectedMode === 'PlayerbVsPlayerw' || selectedMode === 'AIwVsAIb' || selectedMode === 'AIbVsAIw') {
		if (game.history().length >= 1) {
			undo();
		} else {
			if (!isEnglish) {
				alert('无法悔棋');
			} else {
				alert('Nothing to undo.');
			}
		}
	}
	
	// 人机对战-玩家执白先行、人机对战-玩家执黑后行
	if (selectedMode === 'PlayerwVsAIb' || selectedMode === 'PlayerbVsAIw') {
		if (game.history().length >= 2) {
			// Undo twice: Opponent's latest move, followed by player's latest move
			undo();
			window.setTimeout(function() {
				undo();
			}, 250);
		} else {
			if (!isEnglish) {
				alert('无法悔棋');
			} else {
				alert('Nothing to undo.');
			}
		}
	}
}

function redo() {
	game.move(undo_stack.pop());
	board.position(game.fen());
	updateStatus();
}
function boardRedo() {
	// 人人对战、机机对战，Redo once
	if (selectedMode === 'PlayerwVsPlayerb' || selectedMode === 'PlayerbVsPlayerw' || selectedMode === 'AIwVsAIb' || selectedMode === 'AIbVsAIw') {
		if (undo_stack.length >= 1) {
			redo();
		} else {
			if (!isEnglish) {
				alert('无法恢复');
			} else {
				alert('Nothing to redo.');
			}
		}
	}
	
	// 人机对战-玩家执白先行、人机对战-玩家执黑后行
	if (selectedMode === 'PlayerwVsAIb' || selectedMode === 'PlayerbVsAIw') {
		if (undo_stack.length >= 2) {
			// Redo twice: Player's last move, followed by opponent's last move
			redo();
			window.setTimeout(function() {
				redo();
			}, 250);
		} else {
			if (!isEnglish) {
				alert('无法恢复');
			} else {
				alert('Nothing to redo.');
			}
		}
	}
}


// Flip orientation暂无用武之地
// board.flip()
var boardorientationColor = 'white';
function boardorientationWhite() {
	board.orientation('white');
	
	boardorientationColor = 'white';
}
function boardorientationBlack() {
	board.orientation('black');
	
	boardorientationColor = 'black';
}


// 切换配置函数
function changeConfig(configid, configList, currentConfigObj) {
	// 解构出当前配置的名称和更新函数
	var { currentValue, setCurrentValue } = currentConfigObj;
	
	// 获取当前配置在configList中的索引
	var keys = Object.keys(configList);
	var index = keys.findIndex(key => key === currentValue);
	// 计算下一个配置的索引，如果到达列表末尾则循环到开头
	var nextIndex = (index + 1) % keys.length;
	// 获取下一个配置的键名
	var nextConfigKey = keys[nextIndex];
	
	// 更新currentValue的值
	currentConfigObj.setCurrentValue(nextConfigKey);
	
	var node = document.getElementById(configid);
	if (node) {
		// 执行对应的配置函数并更新按钮文本
		configList[nextConfigKey].configfun();
		node.innerHTML = configList[nextConfigKey].text();
	}
}
// 修改样式函数
function cssinsertRule(rule) {
	// 创建一个新的style元素
	var styleElement = document.createElement('style');
	var styleSheet;
	// 将style元素添加到head中
	document.head.appendChild(styleElement);
	// 获取创建的样式表
	styleSheet = styleElement.sheet || styleElement.styleSheet;
	// 在样式表中添加对应的CSS规则
	styleSheet.insertRule(rule, 0);
}


var boardpieceThemeConfigObj = {
	currentValue: 'cburnettTheme', // 初始配置
	setCurrentValue: function(newValue) {
		boardpieceThemeConfigObj.currentValue = newValue; // 直接使用对象名来访问属性
	}
};
function boardpieceTheme() {
	var configid = 'pieceThemeBtn';
	var configList = {
		'cburnettTheme': {
			configfun: () => {config.pieceTheme = 'image/chesspieces/cburnett/{piece}.png'},
			text: () => !isEnglish ? '棋子样式：cburnett' : 'Piece Theme: cburnett',
		},
		'alphaTheme': {
			configfun: () => {config.pieceTheme = 'image/chesspieces/alpha/{piece}.png'},
			text: () => !isEnglish ? '棋子样式：alpha' : 'Piece Theme: alpha',
		},
		'companionTheme': {
			configfun: () => {config.pieceTheme = 'image/chesspieces/companion/{piece}.png'},
			text: () => !isEnglish ? '棋子样式：companion' : 'Piece Theme: companion',
		}
	};
	changeConfig(configid,configList,boardpieceThemeConfigObj);
	
	// 临时修复切换后未即时生效的bug
	if (boardorientationColor == 'white') boardorientationWhite();
	if (boardorientationColor == 'black') boardorientationBlack();
}

var boardThemeConfigObj = {
	currentValue: 'brown', // 初始配置
	setCurrentValue: function(newValue) {
		boardThemeConfigObj.currentValue = newValue; // 直接使用对象名来访问属性
	}
};
function boardTheme() {
	var configid = 'boardThemeBtn';
	var configList = {
		'brown': {
			configfun: () => {
				cssinsertRule('.white-1e1d7 {background-color: #f0d9b5; color: #b58863;}');
				cssinsertRule('.black-3c85d {background-color: #b58863; color: #f0d9b5;}');
			},
			text: () => !isEnglish ? '棋盘样式：brown' : 'Board Theme: brown',
		},
		'green': {
			configfun: () => {
				cssinsertRule('.white-1e1d7 {background-color: #FFFFDD; color: #86A666;}');
				cssinsertRule('.black-3c85d {background-color: #86A666; color: #FFFFDD;}');
			},
			text: () => !isEnglish ? '棋盘样式：green' : 'Board Theme: green',
		},
		'blue': {
			configfun: () => {
				cssinsertRule('.white-1e1d7 {background-color: #DEE3E6; color: #8CA2AD;}');
				cssinsertRule('.black-3c85d {background-color: #8CA2AD; color: #DEE3E6;}');
			},
			text: () => !isEnglish ? '棋盘样式：blue' : 'Board Theme: blue',
		}
	};
	changeConfig(configid,configList,boardThemeConfigObj);
}

var boardshowNotationConfigObj = {
	currentValue: 'true', // 初始配置
	setCurrentValue: function(newValue) {
		boardshowNotationConfigObj.currentValue = newValue; // 直接使用对象名来访问属性
	}
};
function boardshowNotation() {
	var configid = 'showNotationBtn';
	var configList = {
		'true': {
			configfun: () => {
				config.showNotation = true;
				
				// 坐标位置按钮可用
				document.getElementById('notationPositionBtn').disabled = false;
			},
			text: () => !isEnglish ? '坐标显示：开启' : 'Notation: show',
		},
		'false': {
			configfun: () => {
				config.showNotation = false;
				
				// 坐标位置不可用
				document.getElementById('notationPositionBtn').disabled = true;
			},
			text: () => !isEnglish ? '坐标显示：关闭' : 'Notation: hide',
		},
	};
	changeConfig(configid,configList,boardshowNotationConfigObj);
	
	// 临时修复切换后未即时生效的bug
	if (boardorientationColor == 'white') boardorientationWhite();
	if (boardorientationColor == 'black') boardorientationBlack();
}

var boardnotationPositionConfigObj = {
	currentValue: 'inner', // 初始配置
	setCurrentValue: function(newValue) {
		boardnotationPositionConfigObj.currentValue = newValue; // 直接使用对象名来访问属性
	}
};
function boardnotationPosition() {
	var configid = 'notationPositionBtn';
	var configList = {
		'inner': {
			configfun: () => {
				// 注意：与css坐标位置覆盖原样式同步更新
				// 横坐标
				cssinsertRule('.alpha-d2270 {bottom: calc(0% + 0.1vw); right: calc(10% - 0.3vw);}');
				// 纵坐标
				cssinsertRule('.numeric-fc462 {top: calc(0% + 0.1vw); left: calc(0% + 0.1vw);}');
			},
			text: () => !isEnglish ? '坐标位置：内部' : 'Position: inner',
		},
		'outner': {
			configfun: () => {
				// 横坐标
				cssinsertRule('.alpha-d2270 {bottom: calc(0% - 1.7vw); right: calc(50% - 0.5vw);}');
				// 纵坐标
				cssinsertRule('.numeric-fc462 {top: calc(50% - 0.8vw); left: calc(0% - 1.2vw);}');
			},
			text: () => !isEnglish ? '坐标位置：外部' : 'Position: outner',
		},
	};
	changeConfig(configid,configList,boardnotationPositionConfigObj);
}


var AImoveSpeedConfigObj = {
	currentValue: 'normal', // 初始配置
	setCurrentValue: function(newValue) {
		AImoveSpeedConfigObj.currentValue = newValue; // 直接使用对象名来访问属性
	}
};
function AImoveSpeed() {
	var configid = 'AImoveSpeedBtn'
	var configList = {
		'normal': {
			configfun: () => {moveSpeed = DEFAULT_normal_SPEED},
			text: () => !isEnglish ? '行棋速度：正常' : 'Move Speed: normal',
		},
		'slow': {
			configfun: () => {moveSpeed = DEFAULT_slow_SPEED},
			text: () => !isEnglish ? '行棋速度：慢' : 'Move Speed: slow',
		},
		'fast': {
			configfun: () => {moveSpeed = DEFAULT_fast_SPEED},
			text: () => !isEnglish ? '行棋速度：快' : 'Move Speed: fast',
		}
	};
	changeConfig(configid,configList,AImoveSpeedConfigObj);
}

var boardanimationSpeedConfigObj = {
	currentValue: 'normal', // 初始配置
	setCurrentValue: function(newValue) {
		boardanimationSpeedConfigObj.currentValue = newValue; // 直接使用对象名来访问属性
	}
};
function boardanimationSpeed() {
	// data from: default animation speeds
	var DEFAULT_appear_SPEED = 200;
	var DEFAULT_move_SPEED = 200;
	var DEFAULT_snapback_SPEED = 60;
	var DEFAULT_snap_SPEED = 30;
	var DEFAULT_trash_SPEED = 100;
	
	var configid = 'animationSpeedBtn';
	var configList = {
		'normal': {
			configfun: () => {
				config.appearSpeed = DEFAULT_appear_SPEED;
				config.moveSpeed = DEFAULT_move_SPEED;
				config.snapbackSpeed = DEFAULT_snapback_SPEED;
				config.snapSpeed = DEFAULT_snap_SPEED;
				config.trashSpeed = DEFAULT_trash_SPEED;
			},
			text: () => !isEnglish ? '动画速度：正常' : 'Animation Speed: normal',
		},
		'slow': {
			configfun: () => {
				config.appearSpeed = 300;
				config.moveSpeed = 'slow';
				config.snapbackSpeed = 200;
				config.snapSpeed = 150;
				config.trashSpeed = 200;
			},
			text: () => !isEnglish ? '动画速度：慢' : 'Animation Speed: slow',
		},
		'fast': {
			configfun: () => {
				config.appearSpeed = 20;
				config.moveSpeed = 'fast';
				config.snapbackSpeed = 6;
				config.snapSpeed = 3;
				config.trashSpeed = 10;
			},
			text: () => !isEnglish ? '动画速度：快' : 'Animation Speed: fast',
		}
	};
	changeConfig(configid,configList,boardanimationSpeedConfigObj);
}




// 随机移动模式[Random move]
function makeRandomMove() {
	// 人机对战-玩家执白先行、人机对战-玩家执黑后行、机机对战-AI执白先行、机机对战-AI执黑后行
	// Play Random Computer
	if (selectedMode === 'PlayerwVsAIb' || selectedMode === 'PlayerbVsAIw' || selectedMode === 'AIwVsAIb' || selectedMode === 'AIbVsAIw') {
		var possibleMoves = game.moves();
		
		// exit if the game is over
		if (game.game_over()) return;
		
		var randomIdx = Math.floor(Math.random() * possibleMoves.length);
		var move = game.move(possibleMoves[randomIdx]);
		board.position(game.fen());
		
		// 机机对战-AI执白先行、机机对战-AI执黑后行
		// Random vs Random
		if (selectedMode === 'AIwVsAIb' || selectedMode === 'AIbVsAIw') {
			setTimeoutMove();
		}
		
		// Move or Capture audio
		playMoveAudio(move);
		
		updateStatus();
	}
}
