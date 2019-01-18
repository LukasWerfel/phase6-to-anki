var striptags = require('striptags')

const sourceFile = process.argv[2]

const data = require(sourceFile)

const cards = data.replyContent.cards

const transformedCards = cards
  .map(({ cardContent, cardIdString }) => ({
    id: cardIdString,
    question: cardContent.question,
    answer: striptags(cardContent.answer).split("\n")[0],
    label: cardContent.answer.split("\n")[0],
    example: cardContent.answerExample,
    role: striptags(cardContent.questionExample).split("\n")[0],
  }))

console.log(transformedCards[0])
