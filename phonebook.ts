import * as fs from 'fs';
import * as readline from 'readline';

interface PhoneBookEntry {
    name: string;
    phoneNumber: string;
}

const phoneBookFilePath = 'phonebook.json';

function createPhoneBookEntry(): Promise<void> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject) => {
        rl.question('Enter phone number: ', (phoneNumber: string) => {
            rl.question('Enter name: ', (name: string) => {
                rl.close();

                const newEntry: PhoneBookEntry = {
                    name,
                    phoneNumber
                };

                // Check if phone number is already in phone book
                const phoneBook = loadPhoneBook();
                const existingEntry = phoneBook.find(entry => entry.phoneNumber === phoneNumber);
                if (existingEntry) {
                    console.log('Error: Phone number already exists.');
                    console.log(`Name: ${existingEntry.name}`);
                    reject();
                } else {
                    // Add new entry to phone book
                    phoneBook.push(newEntry);
                    savePhoneBook(phoneBook);
                    console.log('Entry added successfully.');
                    resolve();
                }
            });
        });
    });
}

function loadPhoneBook(): PhoneBookEntry[] {
    try {
        const data = fs.readFileSync(phoneBookFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or error in parsing, return an empty array
        return [];
    }
}

function savePhoneBook(phoneBook: PhoneBookEntry[]): void {
    fs.writeFileSync(phoneBookFilePath, JSON.stringify(phoneBook, null, 2));
}

// Main function to start the program
async function main() {
    try {
        await createPhoneBookEntry();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();