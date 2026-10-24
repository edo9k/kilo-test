; Atari 2600 Dino clone
    processor 6502

VSYNC   = $00
VBLANK  = $01
WSYNC   = $02
RSYNC   = $03
NUSIZ0  = $04
NUSIZ1  = $05
COLUP0  = $06
COLUP1  = $07
COLUPF  = $08
COLUBK  = $09
CTRLPF  = $0A
REFP0   = $0B
REFP1   = $0C
PF0     = $0D
PF1     = $0E
PF2     = $0F
RESP0   = $10
RESP1   = $11
RESM0   = $12
RESM1   = $13
RESBL   = $14
AUDC0   = $15
AUDC1   = $16
AUDF0   = $17
AUDF1   = $18
AUDV0   = $19
AUDV1   = $1A
GRP0    = $1B
GRP1    = $1C
ENAM0   = $1D
ENAM1   = $1E
ENABL   = $1F
HMP0    = $20
HMP1    = $21
HMM0    = $22
HMM1    = $23
HMBL    = $24
VDELP0  = $25
VDELP1  = $26
VDELBL  = $27
RESMP0  = $28
RESMP1  = $29
HMOVE   = $2A
HMCLR   = $2B
CXCLR   = $2C

SWCHA   = $280
SWCHB   = $282
INTIM   = $284
TIM64T  = $296

    seg.u Variables
    org $80
PlayerY     ds 1
PlayerState ds 1 ; 0 = standing
VelY        ds 1
JumpCounter ds 1
Frame       ds 1

    seg Code
    org $F000

Start
    sei
    cld
    ldx #$FF
    txs
    lda #0
    ldx #$2D
ClearMem
    sta $00,x
    dex
    bpl ClearMem
    
    ; Initialize
    lda #80
    sta PlayerY
    lda #0
    sta PlayerState
    lda #0
    sta VelY
    lda #0
    sta Frame
    
    ; Set colors
    lda #$0F
    sta COLUBK   ; black background
    lda #$1C
    sta COLUPF   ; green ground
    lda #$0E
    sta COLUP0   ; white dino
    lda #$0E
    sta COLUP1
    
    ; Set playfield for ground
    lda #$F0
    sta PF0
    lda #$FF
    sta PF1
    lda #$F0
    sta PF2
    lda #$01
    sta CTRLPF

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
    lda #43
    sta TIM64T
    
    ; Simple animation
    inc Frame
    
    ; Position player sprite
    lda #40
    sta RESP0
    
    lda PlayerY
    sec
    sbc #10
    sta WSYNC
    ; Simple vertical position (approximate)
    
WaitVB
    lda INTIM
    bne WaitVB
    lda #0
    sta VBLANK
    rts

Kernel
    ; Draw 192 scanlines
    ldx #192
    ldy #0
    
ScanLoop
    sta WSYNC
    
    ; Draw ground on lower scanlines
    cpx #40
    bcc DrawGround
    cpx #50
    bcs DrawSky
    jmp DoneDraw
    
DrawGround
    lda #$1C
    sta COLUBK
    jmp DoneDraw
    
DrawSky
    lda #$0F
    sta COLUBK
    
DoneDraw
    dex
    bne ScanLoop
    
    rts

Overscan
    lda #2
    sta VBLANK
    ldx #30
OverscanLoop
    sta WSYNC
    dex
    bne OverscanLoop
    lda #0
    sta VBLANK
    rts

; Player sprite - simple rectangle
    align 256
PlayerSprite
    .byte %00001100
    .byte %00011100
    .byte %00111100
    .byte %00111100
    .byte %00111100
    .byte %00011100
    .byte %00001100
    .byte %00011000

    org $FFFC
    .word Start
    .word Start
