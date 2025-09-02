\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{john}[2024-11-08 I'm Just a Bill]

\def\fileversion{0.001}
\def\filedate{2024/11/08}

\LoadClass[6pt]{article}

% \usepackage[paperheight=3in,paperwidth=2in,margin=0.2in,heightrounded]{geometry}
\usepackage[paper=a4paper,heightrounded]{geometry}
% \usepackage[text={4.5in,10in},centering]{geometry}
\usepackage{nth}
\usepackage{hanging}
\usepackage{tabto}
\usepackage{amsmath}
\usepackage{lineno}
\usepackage[T1]{fontenc}
\usepackage{parskip}
\usepackage{setspace}

\newcommand{\letterA}{A}
\newcommand{\letterB}{B}
\newcommand{\letterC}{C}
\newcommand{\letterD}{D}
\newcommand{\letterE}{E}
\newcommand{\letterF}{F}
\newcommand{\letterG}{G}
\newcommand{\letterH}{H}
\newcommand{\letterI}{I}
\newcommand{\letterJ}{J}
\newcommand{\letterK}{K}
\newcommand{\letterL}{L}
\newcommand{\letterM}{M}
\newcommand{\letterN}{N}
\newcommand{\letterO}{O}
\newcommand{\letterP}{P}
\newcommand{\letterQ}{Q}
\newcommand{\letterR}{R}
\newcommand{\letterS}{S}
\newcommand{\letterT}{T}
\newcommand{\letterU}{U}
\newcommand{\letterV}{V}
\newcommand{\letterW}{W}
\newcommand{\letterX}{X}
\newcommand{\letterY}{Y}
\newcommand{\letterZ}{Z}

\setlength{\parskip}{0em}

% Command to get the nth letter
\newcommand{\nthletter}[1]{%
	\ifcase#1\or
	\letterA\or
	\letterB\or
	\letterC\or
	\letterD\or
	\letterE\or
	\letterF\or
	\letterG\or
	\letterH\or
	\letterI\or
	\letterJ\or
	\letterK\or
	\letterL\or
	\letterM\or
	\letterN\or
	\letterO\or
	\letterP\or
	\letterQ\or
	\letterR\or
	\letterS\or
	\letterT\or
	\letterU\or
	\letterV\or
	\letterW\or
	\letterX\or
	\letterY\or
	\letterZ\fi
}

\newcommand*{\rom}[1]{\expandafter\@slowromancap\romannumeral #1@}

\newcommand*\sepline{%
	\begin{center}
		\rule[1ex]{.5\textwidth}{.5pt}
\end{center}}

\renewcommand{\title}[1]{\gdef\@title{\textbf{#1}}}
\renewcommand{\description}[1]{\subtitle{#1}}

\newcommand{\ifempty}[3]{%
	\ifx&#1&%
	#2%
	\else
	#3%
	\fi
}

% \newenvironment{mywidth}{\begin{adjustwidth}{2cm}{}}{\end{adjustwidth}}

\renewcommand{\newpage}{}

\newcommand{\header}[6]{\nolinenumbers\noindent\begin{center}
		\Large #4 #5
	\end{center}
	\begin{center}
		\small #3
	\end{center}
	\begin{center} \LARGE \singlespacing \textbf{ #2 } \end{center} \vspace*{3mm}
	#6
}

\newcommand{\whereas}[1]{\hangpara{0.25in}{1}\textbf{\textit{Whereas}} #1}

\newcounter{titlecounter}
\newcounter{sectioncounter}[titlecounter]
\newcounter{subsectioncounter}[sectioncounter]
\newcounter{paragraphcounter}[subsectioncounter]
\newcounter{subparagraphcounter}[paragraphcounter]
\newcounter{clausecounter}[subparagraphcounter]

\renewcommand{\title}[1]{\par\stepcounter{titlecounter}\vspace{1cm}\centerline{\textbf{\Large Article \MakeUppercase{\roman{titlecounter}}\noindent#1}}\vspace{1.5mm}}

\renewcommand{\section}[2]{\par\stepcounter{sectioncounter}\vspace{0.2cm}\noindent\tabto{0cm}\underline{\textbf{\textsc{Sec. \arabic{sectioncounter}\ifempty{#1}{}{: #1}}}}\ifempty{#2}{}{\ignorespaces#2}}

\renewcommand{\subsection}[2]{\par\stepcounter{subsectioncounter}\tabto{0cm}\textbf{(\MakeLowercase{\nthletter{\arabic{subsectioncounter}}}):}\tabto{1cm}\hangpara{1cm}{1}\ifempty{#1}{}{\textsc{#1} —}\ignorespaces#2}

\renewcommand{\paragraph}[2]{\par\stepcounter{paragraphcounter}\tabto{1cm}\textbf{(\MakeLowercase{{\arabic{paragraphcounter}}}):}\tabto{2cm}\hangpara{2cm}{1}\ifempty{#1}{}{\textsc{#1} —}\ignorespaces#2}

\renewcommand{\subparagraph}[2]{\par\stepcounter{subparagraphcounter}\tabto{2cm}\textbf{(\MakeUppercase{\nthletter{\arabic{subparagraphcounter}}}):}\tabto{3cm}\hangpara{3cm}{1}\ifempty{#1}{}{\textsc{#1} —}\ignorespaces#2}

\newcommand{\clause}[2]{\par\stepcounter{clausecounter}\tabto{3cm}\textbf{(\MakeUppercase{\MakeLowercase{\roman{clausecounter}}}):}\tabto*{4cm}\hangpara{4cm}{1}\ifempty{#1}{}{\textsc{#1} —}\ignorespaces#2}

\renewcommand{\S}[0]{§}

\newcommand{\re}[1]{\underline{\textbf{#1}}}

\emergencystretch 3em

\setpagewiselinenumbers
\def\linenumberfont{\normalfont\sffamily}

\doublespacing

\renewcommand{\cite}[5]{}
