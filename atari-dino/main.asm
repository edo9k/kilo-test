; Atari 2600 Dino clone
    processor 6502

VSYNC   = $00
VBLANK  = $01
WSYNC   = $02
COLUPF  = $08
COLUBK  = $09
TIM64T  = $0296
INTIM   = $0284

    seg.u Variables
    org $80
PlayerY     ds 1
PlayerState ds 1 ; 0 run, 1 jump, 2 duck
VelY        ds 1
ObsX        ds 1
ObsType     ds 1 ; 0 cactus, 1 pterodactyl
Score       ds 1
Frame       ds 1

    seg Code
    org $F000

Start
    sei
    cld
    ldx #$FF
    txs
    lda #0
    ldx #$2F
ClearLoop
    sta $00,x
    dex
    bpl ClearLoop
    lda #80
    sta PlayerY
    lda #0
    sta PlayerState
    sta VelY
    lda #120
    sta ObsX
    lda #0
    sta ObsType
    sta Score
    sta Frame

MainLoop
    jsr VerticalSync
    jsr VerticalBlank
    jsr Kernel
    jsr Overscan
    jmp MainLoop

VerticalSync
    lda #2
    sta VSYNC
    sta WSYNC
    sta WSYNC
    sta WSYNC
    lda #0
    sta VSYNC
    rts

VerticalBlank
    lda #35
    sta TIM64T
WaitVB
    lda INTIM
    bne WaitVB
    rts

Kernel
    lda #0
    sta COLUBK
    lda #$0E
    sta COLUPF
    ; draw 192 scanlines
    ldx #192
ScanLoop
    stx WSYNC
    dex
    bne ScanLoop
    rts

Overscan
    lda #2
    sta VBLANK
    ldx #30
OSLoop
    sta WSYNC
    dex
    bne OSLoop
    lda #0
    sta VBLANK
    rts

    org $FFFC
    .word Start
    .word Start
