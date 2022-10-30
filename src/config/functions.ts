export function validateEmail(email: string): boolean {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    } else return false;
}

export function typeCheck(body: any): string | boolean {
    const keys = [];

    for (let key in body) {
        if (key === 'amount' || key === 'userId') {
            if (typeof body[key] !== 'number') {
                keys.push(key);
                break;
            }
        } else if (key === 'email') {
            if (typeof body[key] !== 'string') {
                keys.push(key);
                break;
            }
        } else if (key === 'withdraw') {
            if (typeof body[key] !== 'number') {
                keys.push(key);
                break;
            }
        }
    }

    if (keys.length > 0) {
        return `${keys[0]} is not validate`;
    } else {
        return false;
    }
}
