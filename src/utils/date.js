const formatData = (input) => {
    if (input > 9) {
        return input;
    } else return `0${input}`;
};

const formatHour = (input) => {
    if (input > 12) {
        return input - 12;
    }
    return input;
};

// Data about date
const format = (date) => {
    return {
        dd: formatData(date.getDate()),
        mm: formatData(date.getMonth() + 1),
        yyyy: date.getFullYear(),
        HH: formatData(date.getHours()),
        hh: formatData(formatHour(date.getHours())),
        MM: formatData(date.getMinutes()),
        SS: formatData(date.getSeconds())
    }
};

const format24H = ({ dd, mm, yyyy, HH, MM, SS }) => {
    return `${dd}/${mm}/${yyyy} ${HH}:${MM}:${SS}`;
};

module.exports.format24Hour = (date) => {
    return format24H(format(date));
}