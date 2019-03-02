/////////////////////////////////
// CODING CHALLENGE

/*

Suppose that you're working in a small town administration, and you're in charge of two town elements:
1. Parks
2. Streets

It's a very small town, so right now there are only 3 parks and 4 streets. All parks and streets have a name and a build year.

At an end-of-year meeting, your boss wants a final report with the following:
1. Tree density of each park in the town (forumla: number of trees/park area)
2. Average age of each town's park (forumla: sum of all ages/number of parks)
3. The name of the park that has more than 1000 trees
4. Total and average length of the town's streets
5. Size classification of all streets: tiny/small/normal/big/huge. If the size is unknown, the default is normal

All the report data should be printed to the console.

HINT: Use some of the ES6 features: classes, subclasses, template strings, default parameters, maps, arrow functions, destructuring, etc.

*/

class administrationItem {
    constructor(name, buildYear) {
        this.name = name;
        this.buildYear = buildYear;
    }

    getItemName() {
        return this.name;
    }

    getBuildYear() {
        return this.buildYear;
    }

    getItemAge() {
        return new Date().getFullYear() - this.getBuildYear();
    }
}

class Park extends administrationItem {
    constructor(name, buildYear, treesNumber, parkArea) {
        super(name, buildYear);

        this.treesNumber = treesNumber;
        this.parkArea = parkArea;
    }

    calcTreeDensity() {
        return this.treesNumber / this.parkArea;
    }

    getTreesNumber() {
        return this.treesNumber;
    }
}

class Street extends administrationItem {
    constructor(name, buildYear, streetLength, streetSize = 'normal') {
        super(name, buildYear);

        this.streetLength = streetLength;
        this.streetSize = streetSize;
    }

    getStreetLength() {
        return this.streetLength;
    }

    getStreetSize() {
        return this.streetSize;
    }
}

const parks = new Map();

parks.set(1, new Park('Gogolya', '1992', 1200, 200));
parks.set(2, new Park('Shchorsa', '1994', 800, 140));
parks.set(3, new Park('Shevchenka', '1990', 850, 150));

const treeDensityReport = (parks) => {
    parks.forEach(cur => {
        console.log(`${cur.getItemName()} park tree density is: ${cur.calcTreeDensity()}.`);
    });
};

const parksAverageAge = (parks) => {
    let tempAge = 0;
    parks.forEach(cur => {
        tempAge += cur.getItemAge();
    });

    const averageAge = tempAge / parks.size;

    console.log(`Average parks age is: ${averageAge}`);
};

const parksWithMoreTrees = (parks) => {
    let tempParks = [];

    parks.forEach(cur => {
        if (cur.getTreesNumber() >= 1000) {
            tempParks.push(cur);
        }
    });

    const parksNames = tempParks.map(cur => {
        return cur.getItemName();
    });

    console.log(`Parks with trees more than 1000: ${parksNames}`);
};

const streets = new Map();

streets.set(1, new Street('Gogolya', '1992', 10,));
streets.set(2, new Street('Shchorsa', '1994', 12, 'big'));
streets.set(3, new Street('Shevchenka', '1990', 18, 'huge'));
streets.set(4, new Street('Balenka', '1990', 2, 'tiny'));

const streetsLength = (streets) => {
    let totalStreetsLength = 0;

    streets.forEach(cur => {
        totalStreetsLength += cur.getStreetLength();
    });

    const averageStreetsLength = totalStreetsLength / streets.size;

    console.log(`Total streets length is ${totalStreetsLength} km.`);
    console.log(`Average street length is ${averageStreetsLength} km.`);
};

const streetsSizeClassification = (streets) => {
    streets.forEach(cur => {
       console.log(`${cur.getItemName()} street size classification is: ${cur.getStreetSize()}.`);
    });
};

const yearReport = () => {
    console.log('======================');
    console.log('Year report');
    console.log('======================');
    console.log('----------------------');
    console.log('Parks information');
    console.log('----------------------');

    treeDensityReport(parks);

    parksAverageAge(parks);

    parksWithMoreTrees(parks);

    console.log('----------------------');
    console.log('Streets information');
    console.log('----------------------');

    streetsLength(streets);

    streetsSizeClassification(streets);
};

yearReport();