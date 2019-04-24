*PROCESS RENT
*
         GBLC  &MODNAME
*
&MODNAME SETC  '{{{name}}}'
&MODNAME RSECT ,
&MODNAME AMODE 31
&MODNAME RMODE ANY
*
         SYSSTATE ARCHLVL=2
*
         SAVE  (14,12),,'&MODNAME.  &SYSTIME &SYSDATE' Save regs
         LHI   15,0
         RETURN (14,12),,RC=(15)       Return to caller
*
         END   &MODNAME
