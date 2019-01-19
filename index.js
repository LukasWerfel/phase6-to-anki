const striptags = require('striptags')
const stringify = require('csv-stringify')
const { writeFileSync } = require('fs')


const extractRelevantData = data => data
  .map(({ cardContent, cardIdString }) => {

    const sanitizedExample = striptags(cardContent.answerExample)
    let example = sanitizedExample
    if (sanitizedExample.includes("pl.")) {
      const [trash, ...usefull] = sanitizedExample.split(/(?=[A-Z])/)
      example = usefull.join("")
    }
    return {
      id: cardIdString,
      question: cardContent.question,
      answer: striptags(cardContent.answer).split("\n")[0],
      example: example,
      role: striptags(cardContent.questionExample).split("\n")[0],
    }
  })

const transformToTable = relevantData => {
  const tableHeaders = [ "id", "foreign", "native", "example", "role" ]
  return [tableHeaders].concat(
    relevantData.map(d => [d.id, d.answer, d.question, d.example, d.role])
  )
}

const sourceFile = process.argv[2]
const targetFile = process.argv[3]
const sourceData = require(sourceFile).replyContent.cards

const relevantData = extractRelevantData(sourceData)
const table = transformToTable(relevantData)
stringify(table, (err, csvString) => {
  if (err) return console.error(err)
  writeFileSync(targetFile, csvString, 'utf8')
})
