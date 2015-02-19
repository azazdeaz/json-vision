module.exports = function (rec) {

    var temp;

    switch (rec.type) {

        case 'delete':
            delete rec.object[rec.name];
            break;

        case 'update':
            rec.object[rec.name] = rec.value;
            break;

        case 'add':
            rec.object[rec.name] = rec.value;
            break;

        case 'splice':
            rec.object[rec.name].splice(rec.index, rec.removedCound, ...rec.items);
            break;
    }
};
