const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')

const mediaLibraryPath = path.join(__dirname, 'mediaLibrary.json')

function saveToLibrary(entry) {
    // existing library file
    let library = {}
    if (fs.existsSync(mediaLibraryPath)) {
        library = JSON.parse(fs.readFileSync(mediaLibraryPath))
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