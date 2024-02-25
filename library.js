const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')

const mediaLibraryPath = path.join(__dirname, 'mediaLibrary.json')

function saveToLibrary(entry) {
    // existing library file
    let library = {}
    try {
        if (fs.existsSync(mediaLibraryPath)) {
            const fileContent = fs.readFileSync(mediaLibraryPath, 'utf8')
            if (fileContent) {
            library = JSON.parse(fileContent)
            }
        }
    } catch (err) {
        console.error('Failed to read or parse mediaLibrary.json', err)
        return
    }

    // categorize by type
    if (!library[entry.type]) {
        library[entry.type] = []
    }
    library[entry.type].push(entry)

    // save updated
    fs.writeFileSync(mediaLibraryPath, JSON.stringify(library, null, 2))

    console.log('Entry saved to your media library.')
}

function deleteEntry() {
    // read existing library
    let library = JSON.parse(fs.readFileSync(mediaLibraryPath, 'utf-8'))
    // convert library to array for inquirer
    let choices = []
    for (let type in library) {
        library[type].forEach((entry, index) => {
            choices.push({name: `${entry.title} (${type})`, value: {type, index}})
        });
    }

    inquirer.prompt([
        {
            type: 'list',
            name: 'toDelete',
            message: 'Select an entry to delete:',
            choices: choices
        }
    ]).then(answer => {
        // remove entry
        let {type, index} = answer.toDelete
        library[type].splice(index, 1)
        if (library[type].length === 0) {
            delete library[type] // remove category if empty
        }

        // save updated library
        fs.writeFileSync(mediaLibraryPath, JSON.stringify(library, null, 2))
        console.log('Entry deleted successfully.')
    })
}

function viewEntries() {
    if (!fs.existsSync(mediaLibraryPath)) {
        console.log('No media library found at the given path. Please add some entries first.')
        return
    }
    // read/parse media library file
    const library = JSON.parse(fs.readFileSync(mediaLibraryPath, 'utf-8'))
    // check if library is empty
    if (Object.keys(library.length === 0)) {
        console.log('Your media library is currently empty.')
        return
    }
    console.log('Your media library:')
    for (const type in library) {
        console.log(`\n${type}:`)
        library[type].forEach((entry, index) => {
            console.log(`${index + 1}. Title: ${entry.title}, Score: ${entry.score}/10, 
            Thoughts:${entry.thoughts || 'N/A'}`)
        })
    }

}

function promptUser() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: 'What type of media is this?',
            choices: ['Book', 'Movie', 'Show', 'Anime', 'Album', 'Song', 'Game', 'Other'],
        },
        {
            type: 'input',
            name: 'title',
            message: 'What is the title?',
        },
        {
            type: 'input',
            name: 'score',
            message: 'How would you score it out of 10?',
            validate: input => !isNaN(parseFloat(input)) && parseFloat(input) <= 10 ? true : 'Please enter a number up to 10.'
        },
        {
            type: 'input',
            name: 'thoughts',
            message: 'Any additional thoughts?',
        },
    ]).then(answers => {
        saveToLibrary(answers)
    });
}

function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                { name: 'Add a new entry', value: 'add' },
                { name: 'Delete an existing entry', value: 'delete' },
                { name: 'View all entries', value: 'view'},
                { name: 'Exit', value: 'exit' }
            ]
        }
    ]).then(answer => {
        switch (answer.action) {
            case 'add':
                promptUser()
                break
            case 'delete':
                deleteEntry()
                break
            case 'view':
                viewEntries()
                mainMenu()
                break
            case 'exit':
                console.log('Goodbye!')
                break
            default:
                console.log('Invalid choice')
                mainMenu() // call mainMenu to prompt the choices again
        }
    })
}

  
module.exports = {
    mainMenu
}
    