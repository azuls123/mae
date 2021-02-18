function onlyNumbers(string) {
    let checked = true;
    const numbers = '01234156789';
    console.log(string);
    for (let i = 0; i < string.length; i++) {
        const character = string[i];
        if (numbers.indexOf(character) > -1) {
            string.replace(character, '');
            checked = false;
        }
    }
    return checked;
}