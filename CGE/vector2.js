export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static getDistance(a, b) {
        //return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        return Vector2.subtractVectors(a, b).getLength();
    }

    add(other)
    {
        if(!other instanceof Vector2)throw "Wrong type of argument in vector2.add()";
        this.x += other.x;
        this.y += other.y;
    }

    static addVectors(a, b)
    {
        if(!a instanceof Vector2 || !b instanceof Vector2 )throw "Wrong type of argument in vector2.add()";
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    substract(other)
    {
        if(!other instanceof Vector2)throw "Wrong type of argument in vector2.add()";
        this.x -= other.x;
        this.y -= other.y;
    }

    static subtractVectors(a, b)
    {
        if(!a instanceof Vector2 || !b instanceof Vector2 )throw "Wrong type of argument in vector2.add()";
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    getLength()
    {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    getLengthSqr()
    {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }

    multiple(a)
    {
        this.x *= a;
        this.y *= a;
    }

    divide(a)
    {
        this.x /= a;
        this.y /= a;
    }

    //return this vector with the same direction but length == 1
    normalized()
    {
        let normalized = new Vector2(this.x, this.y);
        normalized.divide(normalized.getLength());
        return normalized;
    }

    static dotProduct(a, b)
    {
        return (a.x*b.x) + (a.y*b.y);
    }

    rotate(degrees)
    {
        let rad = Vector2.degToRad(degrees);
        let oldVector = new Vector2(this.x, this.y);
        this.x = oldVector.x * Math.cos(rad) - oldVector.y * Math.sin(rad);
        this.y = oldVector.x * Math.sin(rad) + oldVector.y * Math.cos(rad);
    }
    
    static  getRotatedVector(vector, degrees)
    {
        if(!vector instanceof Vector2)throw "Wrong type of argument in vector2.add()";
        let rad = Vector2.degToRad(degrees);
        let rotadedVector = new Vector2(0, 0);
        rotadedVector.x = vector.x * Math.cos(rad) - vector.y * Math.sin(rad);
        rotadedVector.y = vector.x * Math.sin(rad) + vector.y * Math.cos(rad);
        return rotadedVector;
    }

    static degToRad(degrees)
    {
        return degrees * (Math.PI/180);
    }

}
