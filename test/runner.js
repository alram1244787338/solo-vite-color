let passed = 0
let failed = 0
let tests = []
let currentSuite = null

export function describe(name, fn) {
  const suite = { name, tests: [] }
  currentSuite = suite
  fn()
  tests.push(suite)
  currentSuite = null
}

export function it(name, fn) {
  if (currentSuite) {
    currentSuite.tests.push({ name, fn })
  } else {
    tests.push({ name, fn, standalone: true })
  }
}

export function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`)
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`)
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`expected ${JSON.stringify(actual)} to be truthy`)
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`expected ${JSON.stringify(actual)} to be falsy`)
      }
    },
    toBeCloseTo(expected, precision = 2) {
      const diff = Math.abs(actual - expected)
      const threshold = 1 / Math.pow(10, precision)
      if (diff > threshold) {
        throw new Error(`expected ${actual} to be close to ${expected} (precision: ${precision})`)
      }
    },
    toBeGreaterThan(expected) {
      if (!(actual > expected)) {
        throw new Error(`expected ${actual} to be greater than ${expected}`)
      }
    },
    toBeLessThan(expected) {
      if (!(actual < expected)) {
        throw new Error(`expected ${actual} to be less than ${expected}`)
      }
    },
    toBeType(type) {
      if (typeof actual !== type) {
        throw new Error(`expected type ${typeof actual} to be ${type}`)
      }
    }
  }
}

export async function run() {
  console.log('\n=== 运行测试 ===')

  for (const test of tests) {
    if (test.standalone) {
      try {
        await test.fn()
        passed++
        console.log(`  ✅ ${test.name}`)
      } catch (err) {
        failed++
        console.log(`  ❌ ${test.name}`)
        console.log(`     ${err.message}`)
      }
    } else {
      console.log(`\n  ${test.name}`)
      for (const t of test.tests) {
        try {
          await t.fn()
          passed++
          console.log(`    ✅ ${t.name}`)
        } catch (err) {
          failed++
          console.log(`    ❌ ${t.name}`)
          console.log(`       ${err.message}`)
        }
      }
    }
  }

  console.log(`\n=== 完成: ${passed} 通过, ${failed} 失败 ===\n`)
  if (failed > 0) process.exit(1)
}
