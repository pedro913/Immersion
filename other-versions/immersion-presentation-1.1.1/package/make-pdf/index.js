const puppeteer = require('puppeteer')
const fetch = require('node-fetch')
const { join } = require('path')

let { port, output } = require('yargs')
  .option('port', {
    default: process.env.PORT || 3000,
    describe: 'Port where development server is running'
  })
  .alias('p', 'port')
  .option('output', {
    default: 'output.pdf',
    describe: 'Filename of output'
  })
  .alias('o', 'output')
  .help('h')
  .alias('h', 'help').argv

async function checkIfServerIsRunning() {
  try {
    const result = await fetch(`http://localhost:${port}`)
    return result.ok
  } catch (e) {
    return false
  }
}

function appendPdfExtensionIfNecessary(str) {
  if (!str.endsWith('.pdf')) {
    return str + '.pdf'
  }
  return str
}

// TODO: GPU disabled headless, pdf disabled with head
async function main() {
  const isRunning = await checkIfServerIsRunning()

  if (!isRunning) {
    console.log(
      `It looks like Immersion is not running at http://localhost:${port}`
    )
    console.log('You can start it by opening another terminal and running')
    console.log('')
    console.log('    yarn start')
    console.log('')
    console.log('or if using npm, ')
    console.log('')
    console.log('    npm run start')
    console.log('')
    console.log('Then run this script.')
    return
  }

  console.log('Loading your presentation ...')
  const browser = await puppeteer.launch({
    headless: true,
    userDataDir: join(__dirname, './user-data-dir'),
    executablePath: '/usr/bin/google-chrome',
    args: [
      '--no-sandbox',
      "--proxy-server='direct://'",
      '--proxy-bypass-list=*'
    ]
  })

  const page = await browser.newPage()
  await page.setViewport({
    width: 1200,
    height: 900
  })
  console.log('Loading ...')
  await page.goto('http://localhost:3000/overview', {
    timeout: 0,
    waitUntil: 'networkidle2'
  })
  console.log('Creating pdf ...')
  await page.pdf({
    path: appendPdfExtensionIfNecessary(output),
    printBackground: true,
    landscape: false,
    height: 900,
    width: 1200
  })
  console.log(`Done! Exported to ${output}`)
  await browser.close()
}

main()
