	processor 6502
	include "vcs.h"

	seg.u variables
	org $80
Temp	ds 1

	seg code
	org $F000

Start
	sei
	cld
	ldx #$FF
	txs
	lda #0
	ldx #$2F
Clear
	sta $00,x
	dex
	bpl Clear

MainLoop
	lda #2
	sta VSYNC
	sta WSYNC
	sta WSYNC
	sta WSYNC
	lda #0
	sta VSYNC

	lda #43
	sta TIM64T
VBlankWait
	lda INTIM
	bne VBlankWait
	lda #0
	sta VBLANK

	; Kernel: draw 192 lines
	ldx #192
KernelLoop
	sta WSYNC
	dex
	bne KernelLoop

	lda #2
	sta VBLANK
	ldx #30
Overscan
	sta WSYNC
	dex
	bne Overscan
	lda #0
	sta VBLANK

	jmp MainLoop

	org $FFFC
	.word Start
	.word Start
