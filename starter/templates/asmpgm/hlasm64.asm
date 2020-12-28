*PROCESS RENT
*
         GBLC  &MODNAME
*
&MODNAME SETC  '{{{name}}}'
&MODNAME RSECT ,
&MODNAME AMODE 64
&MODNAME RMODE ANY
*
         SYSSTATE ARCHLVL=2,                                           +
               AMODE64=YES
*
         SAVE  (14,12),,'&MODNAME.  &SYSTIME &SYSDATE' Save regs
*
         LGHI  15,0                    Set RC = 0
*
         RETURN (14,12),,RC=(15)       Return to caller
*
         END   &MODNAME
