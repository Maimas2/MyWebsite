#include <ti/getcsc.h>
#include <graphx.h>
#include <stdlib.h>
#include <keypadc.h>
#include <time.h>
#include <sys/timers.h>

// 320 x 240

void PrintCentered(const char *str);

bool squares[100] = {
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0
};

const short NumPieces = 30;

short listOfPieces[][11] = {
	{
		2, 3,
		true, false,
		true, true,
		true, false
	},
	{
		2, 3,
		false, true,
		true, true,
		false, true
	},
	{
		3, 2,
		false, true, false,
		true, true, false
	},
	{
		3, 2,
		true, true, true,
		false, true, false
	},
	{
		3, 3,
		true, true, true,
		true, false, false,
		true, false, false
	},
	{
		3, 3,
		true, false, false,
		true, false, false,
		true, true, true
	},
	{
		3, 3,
		false, false, true,
		false, false, true,
		true, true, true
	},
	{
		2, 2,
		true, true,
		true, true
	},
	{
		3, 3,
		true, true, true,
		true, true, true,
		true, true, true
	},
	{
		3, 1,
		true, true, true
	},
	{
		3, 1,
		true, true, true
	},
	{
		3, 1,
		true, true, true
	},
	{
		3, 1,
		true, true, true
	},
	{
		1, 3,
		true,
		true,
		true,
	},
	{
		1, 3,
		true,
		true,
		true,
	},
	{
		1, 3,
		true,
		true,
		true,
	},
	{
		1, 3,
		true,
		true,
		true,
	},
	{
		2, 3,
		true, false,
		true, false,
		true, true
	},
	{
		2, 2,
		false, true,
		true, true
	},
	{
		2, 2,
		true, false,
		true, true
	},
	{
		2, 2,
		true, true,
		true, false
	},
	{
		2, 2,
		true, true,
		false, true
	},
	{
		1, 1,
		true
	},
	{
		1, 1,
		true
	},
	{
		3, 2,
		false, true, false,
		true, true, true
	},
	{
		3, 2,
		true, true, true,
		false, true, false
	},
	{
		1, 2,
		true,
		true,
	},
	{
		2, 1,
		true, true
	},
	{
		1, 2,
		true,
		true,
	},
	{
		2, 1,
		true, true
	}
};

short score = 0;

unsigned short randSeed = 5;
unsigned short randi() {
	randSeed *= 97;
	
	return randSeed;
}

short *threePieces[11] = {NULL, NULL, NULL};
short currentChosenPiece = 0;

#define currentPiece (threePieces[currentChosenPiece])

void DrawSingularPart(short color, short accentColor, bool mini, short x, short y) {
	gfx_SetColor(color);
	gfx_FillRectangle(x + 1, y + 1, 19 - 2*mini, 19 - 2*mini);
	gfx_SetColor(accentColor);
	gfx_Rectangle(x + 6 - mini, y + 6 - mini, 9, 9);
}

void DrawPiece(short piece[], short color, short accentColor, bool mini, short x, short y) {
	for(short i = 0; i < piece[1]; i++) {
		for(short ii = 0; ii < piece[0]; ii++) {
			if(piece[2 + i*piece[0] + ii]) {
				DrawSingularPart(color, accentColor, mini, x + mini + 20 * ii, y + mini + 20 * i);
			}
		}
	}
}

short searchForEmptyRows() {
	short toReturn = 0x0000;
	for(short i = 0; i < 10; i++) {
		toReturn <<= 1;
		short numFull = 0;
		for(short ii = 0; ii < 10; ii++) {
			numFull += squares[i * 10 + ii] > 0;
		}
		if(numFull == 10) {
			toReturn++;
		}
	}
	return toReturn;
}

short searchForEmptyCol() {
	short toReturn = 0x0000;
	for(short i = 0; i < 10; i++) {
		toReturn <<= 1;
		short numFull = 0;
		for(short ii = 0; ii < 10; ii++) {
			numFull += squares[i + 10 * ii] > 0;
		}
		if(numFull == 10) {
			toReturn++;
		}
	}
	return toReturn;
}

short placingX = 1;
short placingY = 2;

const short PointsPerNum[] = {1, 3, 8, 20, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900};

int main(void)
{
	
	gfx_Begin();

	gfx_SetTransparentColor(1);

	short arrowPressed = -1;
	short framesArrowPressed = -1;

	short frames2ndPressed = -1;

	threePieces[0] = listOfPieces[randi() % NumPieces];
	threePieces[1] = listOfPieces[randi() % NumPieces];
	threePieces[2] = listOfPieces[randi() % NumPieces];

	do {
		kb_Scan();

		gfx_SetColor(255);
		gfx_FillRectangle(0, 0, 320, 240);

		gfx_SetColor(154);
		gfx_FillRectangle(20, 20, 200, 200);

		gfx_SetColor(72);
		gfx_Rectangle(19, 19, 202, 202);
		gfx_Rectangle(20, 20, 200, 200);

		for(short ii = 0; ii < 9; ii++) {
			gfx_Line(40 + 20 * ii, 20, 40 + 20 * ii, 220);
			gfx_Line(20, 40 + 20 * ii, 220, 40 + 20 * ii);
		}

		for(short i = 0; i < 100; i++) {
			if(squares[i]) {
				DrawSingularPart(235, 111, false, 20 + 20 * (i % 10), 20 + 20 * (i / 10));
			}
		}

		DrawPiece(currentPiece, 224, 160, true, 20 + placingX * 20, 20 + placingY * 20);

		if(threePieces[0] != NULL) {
			DrawPiece(threePieces[0], 224, 160, true, 240, 20);
			if(currentChosenPiece == 0) {
				gfx_SetColor(0);
				gfx_Rectangle(237, 17, 68, 68);
			}
		}
		if(threePieces[1] != NULL) {
			DrawPiece(threePieces[1], 224, 160, true, 240, 90);
			if(currentChosenPiece == 1) {
				gfx_SetColor(0);
				gfx_Rectangle(237, 87, 68, 68);
			}
		}
		if(threePieces[2] != NULL) {
			DrawPiece(threePieces[2], 224, 160, true, 240, 160);
			if(currentChosenPiece == 2) {
				gfx_SetColor(0);
				gfx_Rectangle(237, 157, 68, 68);
			}
		}

		char tempBuf[17] = {'S', 'c', 'o', 'r', 'e', ':', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '0', '0', '0', '\0'};
		short tscore = score;
		short tindex = 12;
		while(tscore > 0) {
			tempBuf[tindex--] = (char)((tscore % 10) + 48);
			tscore /= 10;
		}
		gfx_PrintStringXY(tempBuf, 100, 232);

		gfx_SwapDraw();

		kb_Scan();

		if(kb_Data[7]) {
			framesArrowPressed++;

			if(kb_Data[7] & kb_Right) {
				arrowPressed = 1;
			} else if(kb_Data[7] & kb_Left) {
				arrowPressed = 3;
			} else if(kb_Data[7] & kb_Up) {
				arrowPressed = 0;
			} else if(kb_Data[7] & kb_Down) {
				arrowPressed = 2;
			}
		} else {
			framesArrowPressed = -1;
			arrowPressed = -1;
		}

		if(kb_Data[1] & kb_2nd) {
			frames2ndPressed++;
			bool canPlace = frames2ndPressed == 0;
			for(short i = 0; i < currentPiece[1]; i++) {
				for(short ii = 0; ii < currentPiece[0]; ii++) {
					if(currentPiece[2 + i * currentPiece[0] + ii]) {
						if(squares[(placingX + ii) + 10 * (placingY + i)]) canPlace = false;
					}
				}
			}
			if(canPlace) {
				for(short i = 0; i < currentPiece[1]; i++) {
					for(short ii = 0; ii < currentPiece[0]; ii++) {
						if(currentPiece[2 + i * currentPiece[0] + ii]) {
							squares[(placingX + ii) + 10 * (placingY + i)] = 1;
						}
					}
				}

				if(placingX > 10-(currentPiece)[0]) placingX = 10-(currentPiece)[0];
				if(placingY > 10-(currentPiece)[1]) placingY = 10-(currentPiece)[1];

				short emptyRows = searchForEmptyRows();

				short emptyCols = searchForEmptyCol();

				short numCleared = 0;
				for(short ii = 0; ii < 10; ii++) {
					if(emptyRows & (1 << 9)) {
						numCleared++;
						for(short i = 0; i < 10; i++) {
							squares[ii * 10 + i] = 0;
							DrawSingularPart(154, 154, false, 20 + 20 * ii, 20 + 20 * i);
						}
					}
					if(emptyCols & (1 << 9)) {
						numCleared++;
						for(short i = 0; i < 10; i++) {
							squares[ii + 10 * i] = 0;
							DrawSingularPart(154, 154, false, 20 + 20 * ii, 20 + 20 * i);
						}
					}

					emptyRows <<= 1;
					emptyCols <<= 1;
				}
				if(numCleared) score += PointsPerNum[numCleared-1];

				threePieces[currentChosenPiece] = NULL;
			}
		} else {
			frames2ndPressed = -1;
		}

		if(kb_Data[1] & kb_Fx) {
			if(threePieces[0] != NULL) currentChosenPiece = 0;
		}
		if(kb_Data[1] & kb_Window) {
			if(threePieces[1] != NULL) currentChosenPiece = 1;
		}
		if(kb_Data[1] & kb_Zoom) {
			if(threePieces[2] != NULL) currentChosenPiece = 2;
		}

		if(threePieces[currentChosenPiece] == NULL) {
			if(threePieces[0] != NULL) {
				currentChosenPiece = 0;
			} else if(threePieces[1] != NULL) {
				currentChosenPiece = 1;
			} else if(threePieces[2] != NULL) {
				currentChosenPiece = 2;
			} else {
				currentChosenPiece = 0;

				threePieces[0] = listOfPieces[randi() % NumPieces];
				threePieces[1] = listOfPieces[randi() % NumPieces];
				threePieces[2] = listOfPieces[randi() % NumPieces];
			}
		}
		
		if(placingX > 10-(currentPiece)[0]) placingX = 10-(currentPiece)[0];
		if(placingY > 10-(currentPiece)[1]) placingY = 10-(currentPiece)[1];

		if(framesArrowPressed % 10 == 0) {
			if(arrowPressed == 0)      placingY--;
			else if(arrowPressed == 1) placingX++;
			else if(arrowPressed == 2) placingY++;
			else if(arrowPressed == 3) placingX--;

			if(placingX < 0) placingX = 0;
			if(placingY < 0) placingY = 0;
			if(placingX > 10-(currentPiece)[0]) placingX = 10-(currentPiece)[0];
			if(placingY > 10-(currentPiece)[1]) placingY = 10-(currentPiece)[1];
		}

		if(kb_Data[6] == kb_Clear) break;

		randSeed++;
		randSeed %= 255;

	} while(true);

	gfx_End();

	return 0;
}

/* Prints a screen centered string */
void PrintCentered(const char *str)
{
	gfx_PrintStringXY(str,
					  (GFX_LCD_WIDTH - gfx_GetStringWidth(str)) / 2,
					  (GFX_LCD_HEIGHT - 8) / 2);
}
