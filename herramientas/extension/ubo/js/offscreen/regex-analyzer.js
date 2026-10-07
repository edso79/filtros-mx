// NO es de uBlock Origin: es un sustituto escrito para Filtros MX.
//
// make-scriptlets.js lo importa solo para las reglas cuyo dominio es una
// expresion regular (`/regex/##+js(...)`). El original de uBlock arrastra la
// biblioteca regexanalyzer entera, y construir-scriptlets.mjs ya descarta esas
// reglas antes de llegar aqui. Si alguna se colara, mejor fallar alto que
// compilar una regla a medias.
export function literalStrFromRegex() {
  throw new Error('Filtros MX no compila scriptlets con dominio por expresion regular');
}
