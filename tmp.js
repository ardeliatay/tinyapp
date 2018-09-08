var pig {
  name: "waldo"
}

console.log(pig["name"]);
console.log(pig.name);

pig.name = "bob";

pig.age = 10;

console.log(pig.age);

delete pig.name;

pig.location = "canada";

