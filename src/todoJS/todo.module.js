export default function(title, description, duedate, priority, color){
    function changeClr(r, g, b){
        color = `${r}, ${g}, ${b}`;
    }

    function getClr()
    {
        return color;
    }

    const date = new Date();

    return {title, description, duedate, priority, changeClr, getClr, dateOfCreation: `${date.getDate()}, ${date.getMonth() + 1}, ${date.getFullYear()}`};
}