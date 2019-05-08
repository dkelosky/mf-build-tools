//{{{settings.name}}} JOB {{{settings.account}}},
//             '{{{settings.description}}}',
//             MSGCLASS={{{settings.messageClass}}},
//             CLASS={{{settings.jobClass}}},
//             MSGLEVEL=(1,1),
//             REGION=0M
/*JOBPARM SYSAFF=*
{{#each deploy.ftp.sources}}
//*
//* FTP {{{@key}}}
//*
//FTPOUT   EXEC PGM=IKJEFT01,REGION=4M,DYNAMNBR=128
//SYSTCPD  DD   DISP=SHR,DSN=VTAM.TCPIP.TCPIP.DATA
//SYSTSPRT DD   SYSOUT=*
//OUTPUT   DD   SYSOUT=*
//SYSTSIN  DD  *
{{#if target}}
FTP {{{target}}}
{{else}}
FTP {{{../deploy.ftp.target}}}
{{/if}}
/*
//INPUT    DD   *
{{#if options}}
{{#each options}}
{{{.}}}
{{/each}}
{{else}}
{{#each ../deploy.ftp.options}}
{{{.}}}
{{/each}}
{{/if}}
{{#if includes}}
{{#each includes}}
put {{{.}}}
{{/each}}
{{else}}
{{#each ../deploy.ftp.includes}}
put {{{.}}}
{{/each}}
{{/if}}
quit
/*
{{/each}}
