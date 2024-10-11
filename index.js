const http = require('http');
const url = require('url');

const port = 3000;
let students = [
    { id: 1, name: 'Indiphile Vani', age: "19"},
    { id: 2, name: 'Inako Zonke', age:"20" }
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;

    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET' && pathname === '/students') {
        res.writeHead(200);
        res.end(JSON.stringify(students));
        return; // Prevent further execution
    } 

    if (req.method === 'GET' && pathname.startsWith('/students/')) {
        const id = parseInt(pathname.split('/')[2]);
        const student = students.find(s => s.id === id);
        if (!student) {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Student not found.' }));
        } else {
            res.writeHead(200);
            res.end(JSON.stringify(student));
        }
        return; // Prevent further execution
    } 

    if (req.method === 'POST' && pathname === '/students') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { name, age } = JSON.parse(body);
                const newStudent = { id: students.length + 1, name, age };
                students.push(newStudent);
                res.writeHead(201);
                res.end(JSON.stringify({ message: 'new syudent added successfully' }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
            }
        });
        return; // Prevent further execution
    } 

    if (req.method === 'PUT' && pathname.startsWith('/students/')) {
        const id = parseInt(pathname.split('/')[2]);
        const student = students.find(s => s.id === id);
        if (!student) {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Student not found.' }));
        } else {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const { name, age } = JSON.parse(body);
                    student.name = name;
                    student.age = age;
                    
                    res.writeHead(200);
                    res.end(JSON.stringify({ message: ' updated successfully', id }));
                } catch (error) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ message: 'Invalid JSON' }));
                }
            });
        }
        return; // Prevent further execution
    } 

    if (req.method === 'DELETE' && pathname.startsWith('/students/')) {
        const id = parseInt(pathname.split('/')[2]);
        const studentIndex = students.findIndex(s => s.id === id);
        if (studentIndex === -1) {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Student not found.' }));
        } else {
            students.splice(studentIndex, 1);
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Deleted successfully', id }));
        }
        return; // Prevent further execution
    } 

    // Fallback for all other requests
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Not Found' }));
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});