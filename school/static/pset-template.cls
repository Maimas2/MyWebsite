\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{pset-template}

\def\fileversion{0.001}
\def\filedate{2026/8/26}

\LoadClass{article}

\usepackage[text={7.5in,9.3in},centering,includehead]{geometry}
\usepackage{fancyhdr}
\usepackage[]{amsmath,amsthm,amssymb}
\usepackage[]{mathtools}
\usepackage{parskip}
\usepackage{asymptote}
\usepackage{cancel}
\usepackage{wrapfig}
\usepackage{framed}

\pagestyle{fancy}

%\setlength{\parskip}{0em}

\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\footrulewidth}{0.4pt}

\newcounter{questioncount}
\setcounter{questioncount}{1}

\newcounter{subquestioncount}
\setcounter{subquestioncount}{1}

\def \endofquestion {\newpage}

\newcommand\nopagebreakafterquestion{\renewcommand\endofquestion{\vspace*{0.3in}\sepline\vspace*{0in}}}

\DeclarePairedDelimiter\norm{\lVert}{\rVert}

\makeatletter
\let\oldabs\abs
\def\abs{\@ifstar{\oldabs}{\oldabs*}}
%
\let\oldnorm\norm
\def\norm{\@ifstar{\oldnorm}{\oldnorm*}}
\makeatother

%\newcounter{subqcount}{questioncount}

\newcommand*\sepline{%
	\begin{center}
		\rule[1ex]{.9\textwidth}{.5pt}
\end{center}}

\newcommand\psettitle[3]{
	\fancyhead{}
	\fancyhead[L]{\textbf{PSET \##1 by Alex Seltzer})}}
	\fancyhead[R]{\textbf{#2}}
	\fancyfoot{}
	\fancyfoot[L]{#3}
	\fancyfoot[R]{Pg. \thepage}
    \begin{center}
        \textbf{#3}
    \end{center}
}

\newcommand\questionheader[0]{{ \begin{center}\Large \textbf{Question \#\arabic{questioncount}}\end{center} } \vspace*{0.2in}\stepcounter{questioncount}\setcounter{subquestioncount}{1}}

\newcommand\subquestionheader[0]{{ \textbf{(\alph{subquestioncount})} } \stepcounter{subquestioncount}}

\newcommand\angb[1]{\left\langle#1\right\rangle}

\newcommand\question[1]{\questionheader#1\endofquestion}

\newcommand\qimplies{\quad\implies\quad}

\newcommand\invisiblesection[1]{%
  \refstepcounter{section}%
  \addcontentsline{toc}{section}{\protect\numberline{\thesection}#1}%
  \sectionmark{#1}}
