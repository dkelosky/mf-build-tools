//{{{settings.name}}} JOB {{{settings.account}}},
//             '{{{settings.description}}}',
//             MSGCLASS={{{settings.messageClass}}},
//             CLASS={{{settings.jobClass}}},
//             MSGLEVEL=(1,1),
//             REGION=0M
/*JOBPARM SYSAFF=*
{{#each job.compile.sources}}
//*
//* Metal C {{{@key}}}
//*
//         IF (RC = 0) THEN
//MTL{{@index}} EXEC PGM=CCNDRVR,
//          PARM=('OPTFILE(DD:OPTIONS)',
//         'LIST(DD:LISTOUT)')
//OPTIONS  DD  *
{{!-- if options at this object level, use them  --}}
{{#if options}}
{{#each options}}
{{{.}}}
{{/each}}
{{!-- else use options at the higher context level  --}}
{{else}}
{{#each ../job.compile.options}}
{{{.}}}
{{/each}}
{{/if}}
/*
//LISTOUT  DD  SYSOUT=*
//STEPLIB  DD  DISP=SHR,DSN=CEE.SCEERUN2
//         DD  DISP=SHR,DSN=CBC.SCCNCMP
//         DD  DISP=SHR,DSN=CEE.SCEERUN
//USERLIB  DD  DISP=SHR,
// DSN={{{../settings.hlq}}}.CHDR
{{#if includes}}
{{#each includes}}
//         DD  DISP=SHR,
// DSN={{{.}}}
{{/each}}
{{else}}
{{#each ../job.compile.includes}}
//         DD  DISP=SHR,
// DSN={{{.}}}
{{/each}}
{{/if}}
//SYSIN    DD  DISP=SHR,
// DSN={{{../settings.hlq}}}.CPGM({{{@key}}})
//SYSLIN   DD  DISP=SHR,
// DSN={{{../settings.hlq}}}.ASMPGM({{{@key}}})
//SYSTERM  DD  SYSOUT=*
//SYSPRINT DD  SYSOUT=*
{{#if jclStatements}}
{{#each jclStatements}}
{{{.}}}
{{/each}}
{{else}}
{{#each ../job.compile.jclStatements}}
{{{.}}}
{{/each}}
{{/if}}
//         ENDIF
{{/each}}
{{#each job.assemble.sources}}
//*
//* Assemble {{{@key}}}
//*
//         IF (RC = 0) THEN
//ASM{{@index}} EXEC PGM=ASMA90
//ASMAOPT  DD  *
{{!-- if options at this object level, use them  --}}
{{#if options}}
{{#each options}}
{{{.}}}
{{/each}}
{{!-- else use options at the higher context level  --}}
{{else}}
{{#each ../job.assemble.options}}
{{{.}}}
{{/each}}
{{/if}}
/*
//SYSADATA DD  DISP=SHR,
// DSN={{{../settings.hlq}}}.ADATA({{{@key}}})
//SYSLIB   DD  DISP=SHR,
// DSN={{{../settings.hlq}}}.ASMMAC
{{#if includes}}
{{#each includes}}
//         DD  DISP=SHR,
// DSN={{{.}}}
{{/each}}
{{else}}
{{#each ../job.assemble.includes}}
//         DD  DISP=SHR,
// DSN={{{.}}}
{{/each}}
{{/if}}
//SYSTERM  DD  SYSOUT=*
//SYSPRINT DD  SYSOUT=*
//SYSIN    DD  DISP=SHR,
// DSN={{{../settings.hlq}}}.ASMPGM({{{@key}}})
//SYSLIN   DD  DISP=SHR,
// DSN={{{../settings.hlq}}}.OBJLIB({{{@key}}})
{{#if jclStatements}}
{{#each jclStatements}}
{{{.}}}
{{/each}}
{{else}}
{{#each ../job.assemble.jclStatements}}
{{{.}}}
{{/each}}
{{/if}}
//         ENDIF
{{/each}}
{{#each job.bind.sources}}
//*
//* Bind {{{@key}}}
//*
//         IF (RC < 4) THEN
//BND{{@index}}    EXEC PGM=IEWL,PARM='OPTIONS=IEWLOPT'
//IEWLOPT  DD  *
{{!-- if options at this object level, use them  --}}
{{#if options}}
{{#each options}}
{{{.}}}
{{/each}}
{{!-- else use options at the higher context level  --}}
{{else}}
{{#each ../job.bind.options}}
{{{.}}}
{{/each}}
{{/if}}
/*
//OBJECT   DD  DISP=SHR,
// DSN={{{../settings.hlq}}}.OBJLIB
{{#if includes}}
{{#each includes}}
//         DD  DISP=SHR,
// DSN={{{.}}}
{{/each}}
{{else}}
{{#each ../job.bind.includes}}
//         DD  DISP=SHR,
// DSN={{{.}}}
{{/each}}
{{/if}}
//SYSLIN   DD  *
 INCLUDE OBJECT({{{@key}}})
 {{#if objects}}
 {{#each objects}}
 INCLUDE OBJECT({{{.}}})
 {{/each}}
 {{else}}
 {{#each ../job.bind.objects}}
 INCLUDE OBJECT({{{.}}})
 {{/each}}
 {{/if}}
 SETOPT PARM(REUS=REFR)
 ORDER {{{@key}}}(P)
 {{#if entry}}
 ENTRY {{{entry}}}
 {{else}}
 ENTRY {{{@key}}}
 {{/if}}
{{#if name}}
 NAME {{{name}}}(R)
{{else}}
 NAME {{{@key}}}(R)
{{/if}}
/*
{{#if name}}
//SYSLMOD  DD  DISP=SHR,
// DSN={{{../settings.hlq}}}.LOADLIB({{{name}}})
{{else}}
//SYSLMOD  DD  DISP=SHR,
// DSN={{{../settings.hlq}}}.LOADLIB({{{@key}}})
{{/if}}
//SYSTERM  DD  SYSOUT=*
//SYSPRINT DD  SYSOUT=*
{{#if jclStatements}}
{{#each jclStatements}}
{{{.}}}
{{/each}}
{{else}}
{{#each ../job.bind.jclStatements}}
{{{.}}}
{{/each}}
{{/if}}
//         ENDIF
{{/each}}
{{#each job.execute.sources}}
//*
//* Execute {{{@key}}}
//*
//         IF (RC = 0) THEN
//RUN      EXEC PGM={{{@key}}}{{#if options}},
//         PARM=({{{options}}}){{/if}}
//STEPLIB  DD  DISP=SHR,
// DSN={{{../settings.hlq}}}.LOADLIB
{{#if jclStatements}}
{{#each jclStatements}}
{{{.}}}
{{/each}}
{{else}}
{{#each ../job.execute.jclStatements}}
{{{.}}}
{{/each}}
{{/if}}
//         ENDIF
{{/each}}
