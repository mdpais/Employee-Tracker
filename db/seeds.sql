INSERT INTO department (name)
VALUES ("Marketing"),
("Human Resources"),
("Customer Support"),
("Training");

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Manager", 80000.00, 1),
("HR Manager", 70000.00, 2),
("Customer Support Manager", 60000.00, 3),
("Training Manager", 60000.00, 4),
("Customer Support Agent", 30000.00, 3),
("Marketing Specialist", 50000.00, 1),
("Level 2 Agent", 35000.00, 3),
("Director", 100000.00,);
       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 8,)
("Jeremy", "Clarkson", 1, 1),
("Phoebe", "Buffay", 2, 1),
("Joseph", "Tribiani", 6, 2),
("Monica", "Gellar", 4, 1),
("Chandler", "Bing", 3, 1),
("Ross", "Geller", 7, 6),
("Rachel", "Green", 6, 2),
("Richard", "Burke", 5, 6),
("Janice", "Hosenstein", 5, 6),
("Mike", "Hannigan", 6, 2),
("Carol", "Willick", 7, 6),
("Susan", "Bunch", 7, 6),
("Emily", "Waltham", 7, 6),
("Ursula", "Buffay", 7, 6),
("Tag", "Jones", 6, 2);