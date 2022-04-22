// 6-1 finción unaria

const indetity = x => x
console.log(indetity("Hello World"))

// 6-2 función binaria
const add = (x, y) => x + y

// 6-3 función variádica

function variadic(a) {
  console.log(a)
  console.log(arguments)
}

// 6-4

const variadicTwo = (a, ...variadic) => {
  console.log(a)
  console.log(variadic)
}

console.log(variadicTwo(1, 2, 3))

// 6-5

const curry = binaryFn => {
  return function (firstArg) {
    return function (secondArg) {
      return binaryFn(firstArg, secondArg)
    }
  }
}

// Convertimos nuestra función add en una función currying

let addCurriedAdd = curry(add)
console.log(addCurriedAdd(2)(2))

//* Casos de uso

// Crear una función para crear tablas

const tableOf2 = y => 2 * y
const tableOf3 = y => 3 * y
const tableOf4 = y => 4 * y

console.table({
  [tableOf2.name]: tableOf2(4),
  [tableOf3.name]: tableOf3(4),
  [tableOf4.name]: tableOf4(4),
})

// Puedes pasar un segunda argumento, lo hara más sencillo.

const genericTable = (x, y) => x * y

console.table({
  [tableOf2.name]: genericTable(2, 4),
  [tableOf3.name]: genericTable(3, 4),
  [tableOf4.name]: genericTable(4, 4),
}) // Haremos tablas usando la función curry
;(() => {
  const tableOf2 = curry(genericTable)(2)
  const tableOf3 = curry(genericTable)(3)
  const tableOf4 = curry(genericTable)(4)

  console.log("Tables via currying")
  console.log("2 * 2 =", tableOf2(2))
  console.log("2 * 3 =", tableOf2(3))
  console.log("2 * 4 =", tableOf2(4))
  console.log("3 * 2 =", tableOf3(2))
  console.log("3 * 3 =", tableOf3(3))
  console.log("3 * 4 =", tableOf3(4))
  console.log("4 * 2 =", tableOf4(2))
  console.log("4 * 3 =", tableOf4(3))
  console.log("4 * 4 =", tableOf4(4))
})()
;(() => {
  // creando una función loggerHelper

  const loggerHelper = (
    mode,
    initialMessage,
    errorMessage,
    lineNo,
  ) => {
    if (mode === "DEBUG")
      console.debug(
        initialMessage,
        errorMessage + "at line: " + lineNo,
      )
    else if (mode === "ERROR")
      console.error(
        initialMessage,
        errorMessage + "at line: " + lineNo,
      )
    else if (mode === "WARN")
      console.warn(
        initialMessage,
        errorMessage + "at line: " + lineNo,
      )
    else throw "Wrong mode"
  }
  // Para solucionar este problema  crearemos una función curry que aceptara n argumentos

  let curry = fn => {
    if (typeof fn !== "function") {
      throw Error("No function provided")
    }

    return function curriedFn(...args) {
      // chequeamos si los argumentos pasados vía ...args y los argumentos de la función fn es menor o no.
      if (args.length < fn.length) {
        // fn.length = cantidad de parametros que espera la funcion pasada por curry
        // args.length = cantidad de argumentos que recive la función curriedFn
        // Aquí llamanos la función curriedFn recursivamente
        return function () {
          // usando la función concat, estamos concatenando los argumentos que se pasan uno a la vez llamando  a curriedFn resursivamente. Debido a que estamos combinando todos los argumentos pasados y llamandolo recursivamente, encontraremos punto en la cual la condición if falla
          // arguments son los argumentos que recibe la función anónima de arriba

          return curriedFn.apply(
            null,
            args.concat([].slice.call(arguments)),
          )
        }
      }
      return fn.apply(null, args)
    }
  }

  const multiply = (x, y, z) => x * y * z

  console.log("Curry Function: ", curry(multiply)(3)(2)(1))

  // Implementación de la función curry en loggerHelper
  let errorLogger = curry(loggerHelper)("ERROR")(
    "Error At Stats.js",
  )
  let debugLogger = curry(loggerHelper)("DEBUG")(
    "Debug At Stats.js",
  )
  let warnLogger = curry(loggerHelper)("WARN")(
    "Warn At Stats.js",
  )

  // Implementamos las funciones para cda caso de uso

  //for error
  errorLogger("Error message", 21)
  //for debug
  debugLogger("Debug message", 233)
  //for warn
  warnLogger("Warn message", 34)
  // la función curry nos ayuda a eliminar codigo repetitivo en las llamadas a las funciones

  let match = curry(function (expr, str) {
    return str.match(expr)
  })

  let hasNumber = match(/[0-9]+/)

  let filter = curry(function (f, ary) {
    return ary.filter(f)
  })

  let findNumbersInArray = filter(hasNumber)

  console.log(findNumbersInArray(["js", "number1"]))

  let map = curry(function (f, ary) {
    return ary.map(f)
  })
  let squareAll = map(x => x * x)
  console.log(squareAll([1, 2, 3]))

  let isEven = function (num) {
    return num % 2 === 0
  }

  let findEvenOfArray = filter(isEven)

  console.log(findEvenOfArray([1, 2, 3, 4, 5]))

  let isPrime = function (num) {
    if (num === 2) {
      return true
    } else if (num > 1) {
      for (var i = 2; i < num; i++) {
        if (num % i !== 0) {
          return true
        } else if (num === i * i) {
          return false
        } else {
          return false
        }
      }
    } else {
      return false
    }
  }

  let findPrimeOfArray = filter(isPrime)

  console.log(
    findPrimeOfArray([
      1, 2, 3, 4, 5, 6, 123, 245, 324, 526, 234, 23, 124,
      324,
    ]),
  )
  const setTimeoutWrapper = (time, fn) => {
    setTimeout(fn, time)
  }
  const delayTenMs = curry(setTimeoutWrapper)(10)
  delayTenMs(() => console.log("Do X task"))
  delayTenMs(() => console.log("Do Y task"))
})()
;(() => {
  // Implementación de la función partial correctamente
  const partial = function (fn, ...partialArgs) {
    return function (...fullArguments) {
      let args = [...partialArgs]
      let arg = 0
      for (
        let i = 0;
        i < args.length && arg < fullArguments.length;
        i++
      ) {
        if (args[i] === undefined) {
          args[i] = fullArguments[arg++]
        }
      }
      return fn.apply(null, args)
    }
  }

  let delayTenMs = partial(setTimeout, undefined, 10)
  delayTenMs(() => console.log("Do Y task"))

  let obj = { foo: "bar", bar: "foo" }
  JSON.stringify(obj, null, 2)

  let prettyPrintJson = partial(
    JSON.stringify,
    undefined,
    null,
    2,
  )
  console.log(prettyPrintJson([1, 2, 3, 4]))
  console.log(prettyPrintJson(obj))
})()
