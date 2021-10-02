function lineinterection(A, B, C, D) {
    intersect = true;
    Dn = (B[0] - A[0]) * -(D[1] - C[1]) - (B[1] - A[1]) * -(D[0] - C[0]);
    Dx = (C[0] - A[0]) * -(D[1] - C[1]) - (C[1] - A[1]) * -(D[0] - C[0]);
    Dy = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
    alpha = Dx / Dn;
    beta = Dy / Dn;
    wx = (B[0] - A[0]) * alpha;
    wy = (B[1] - A[1]) * alpha;
    x = A[0] + wx;
    y = A[1] + wy;
    if (x == Infinity || y == Infinity) {
        //console.log("parralel");
        intersect = false;
    }

    if (x == NaN || y == NaN) {
        intersect = false;
    }
//Math.sqrt(Math.pow(wx,2)+Math.pow(wy,2)) >= Math.sqrt(Math.pow(B[0]-A[0],2)+Math.pow(B[1]-A[1],2)) || wx+Math.abs[wx] == (B[0]-A[0])+Math.abs(B[0]-A[0])  || wy+Math.abs[wy] == (B[1]-A[1])+Math.abs(B[1]-A[1])
    if (alpha < 0 || alpha > 1 || beta < 0 || beta > 1) {
//console.log("no intersect");
        intersect = false;
    }


    //console.log(x,y, wx, wy,Math.sqrt(Math.pow(wx,2)+Math.pow(wy,2)),Math.sqrt(Math.pow(B[0]-A[0],2)+Math.pow(B[1]-A[1],2)));
    return [x, y, intersect];
}

function checkinsidepolygon(polygon, A, distance) {
    var bla;
    var acle = 0;
    for (angle = 0; angle <= Math.PI * 2; angle += 0.01) {
        var B = [A[0] * Math.cos(angle) + distance, A[1] * Math.sin(angle) + distance];
        var tbla = checkPolygonBorderIntersection(polygon, A, B);
        if (tbla.length > acle) {
            bla = tbla;
            acle = tbla.length;
        }
    }
    if (bla.length % 2 === 0) {
        return false;
    } else {
        return true;
    }
}

function calculateAngle(A, B) {
    return Math.PI/2-Math.atan2(B[1] - A[1], B[0] - A[0]);
}

function calculateAnglebetweenLines(A, B, C) {
    return (Math.atan2(C[1] - B[1], C[0] - B[0]) - Math.atan2(A[1] - B[1], A[0] - B[0]));
}

function jsonGPSPolygontopolygon(jsonpolygon) {
    const items = [];
    let zeropoint = [jsonpolygon[0].lat, jsonpolygon[0].long]
    for (let i = 0; i < jsonpolygon.length; i++) {
        items.push([(jsonpolygon[i].lat - zeropoint[0]) * 111.3 * 1000, (jsonpolygon[i].long - zeropoint[1]) * (111.3 * Math.cos(jsonpolygon[i].lat * Math.PI / 180)) * 1000]);
    }
    return [items, zeropoint];
}

function routeToGPSroute(polygon,zeroPoint) {
    let polygonObjectArray = []

    for (let i = 0; i < polygon.length; i++) {

        const lat = latitudeMeterDistance(polygon[i][0])+zeroPoint[0];
        const long = longitudeMeterDistance(polygon[i][1], lat)+zeroPoint[1];

        polygonObjectArray.push({lat: lat,long: long,height: 0,alt: 0})
    }
    return polygonObjectArray;
}

function checkPolygonBorderIntersection(polygon, A, B) {
    var items = []
    for (i = 0; i < polygon.length - 1; i++) {
        var r = lineinterection(polygon[i], polygon[i + 1], A, B);
        if (r[2] === true) {
            items.push([r[0], r[1], i]);
        }
    }
    var b = lineinterection(polygon[polygon.length - 1], polygon[0], A, B);
    if (b[2] === true) {
        items.push([b[0], b[1], polygon.length - 1]);
    }
    return items;
}

/**
 * @param {distance in meters} distance
 * @returns latitude difference
 */
function latitudeMeterDistance(distance) {
    //
    return distance * (0.001 / 111.3);
}

function longitudeMeterDistance(distance, lat) {
    return distance * (0.001 / (111.3 * Math.cos(lat * Math.PI / 180)));
}

function getLine(A, angle, distance) {
    return [A[0] + Math.sin(angle) * distance, A[1] + Math.cos(angle) * distance];
}

function createZigZagRoute(polygon, keepouts, startposition = undefined, startangle = undefined) {
//console.log(lineinterection([0,1],[4,0],[0,2],[2,0])[2]);
    const outroute = [];
    polygon = jsonGPSPolygontopolygon(polygon)
    zeropoint = polygon[1];
    polygon = polygon[0];
    console.log(polygon, "zeropoint: ", zeropoint);
    if (polygon.length < 3) return;

    if (startposition == undefined) {
        startposition = polygon[0];
    }
    if (startangle == undefined) {
        startangle = calculateAngle(polygon[0], polygon[1]);
    }
    console.log(checkPolygonBorderIntersection(polygon, [49.99180378186631, 9.223430172719237], [49.99227281219823, 9.22333897761273]));
    console.log(startangle * 180 / Math.PI);
//console.log(checkinsidepolygon(polygon, [49.99180378186631,9.223430172719237], 5));
    console.log(calculateAnglebetweenLines(polygon[polygon.length - 1], startposition, polygon[1]));

    var a = calculateAngle(polygon[1], polygon[0]);

    var s = [(polygon[0][0] + Math.sin(a) * 4 + Math.sin(a + (90 * Math.PI / 180)) * 4), (polygon[0][1] + Math.cos(a) * 4 + Math.cos(a + (90 * Math.PI / 180)) * 4)]
    console.log(a);
    polygon.push(s);
    var d = 0;
    var bla = [];
    var t = true;
    while(bla.length<1 && t){
    bla = checkPolygonBorderIntersection(polygon, s, getLine(s, a, d));
    d += 0.01;
    console.log(bla);
    console.log(getLine(s, a, d));

    if (d > 1) {
        t = false;
    }
}
    return routeToGPSroute(polygon, zeropoint);
}

var MissionGenerator = {
    createZigZagRoute: createZigZagRoute
}
module.exports = MissionGenerator;
