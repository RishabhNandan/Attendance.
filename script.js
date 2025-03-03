let students = [];
let attendance = {};
let username = '';
let password = '';
let registeredUsers = {};
$(document).ready(function() {
    if (localStorage.getItem('username') && localStorage.getItem('password')) {
        username = localStorage.getItem('username');
        password = localStorage.getItem('password');
        $('#loginButton').hide();
        $('#usernameDisplay').text('Welcome, ' + username).show();
        $('#logoutButton').show();
        $('#addStudentButton').show();
        $('#markAttendanceButton').show();
        $('#viewAttendanceButton').show();
        $('#exportToExcelButton').show();
        $('#studentTable').show();
    }
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        let inputUsername = $('#username').val();
        let inputPassword = $('#password').val();
        if (registeredUsers[inputUsername] && registeredUsers[inputUsername] === inputPassword) {
            username = inputUsername;
            password = inputPassword;
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            $('#loginModal').modal('hide');
            $('#loginButton').hide();
            $('#usernameDisplay').text('Welcome, ' + username).show();
            $('#logoutButton').show();
            $('#addStudentButton').show();
            $('#markAttendanceButton').show();
            $('#viewAttendanceButton').show();
            $('#exportToExcelButton').show();
            $('#studentTable').show();
        }
    });

    $('#logoutButton').click(function() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        username = '';
        password = '';
        location.reload();
    });

    $('#registerForm').submit(function(e) {
        e.preventDefault();
        let registerUsername = $('#registerUsername').val();
        let registerPassword = $('#registerPassword').val();
        let confirmPassword = $('#confirmPassword').val();
        if (registerPassword === confirmPassword) {
            registeredUsers[registerUsername] = registerPassword;
            $('#registerModal').modal('hide');
            $('#loginButton').show();
            $('#registerButton').hide();
        } else {
            console.log('Passwords do not match');
        }
    });
    $('#addStudentForm').submit(function(e) {
        e.preventDefault();
        let studentId = $('#studentId').val();
        let studentName = $('#studentName').val();
        let subject = $('#subject').val();
        students.push({ id: studentId, name: studentName, subject: subject });
        $('#studentTableBody').append('<tr><td>' + studentId + '</td><td>' + studentName + '</td><td>' + subject + '</td><td></td></tr>');
        $('#addStudentModal').modal('hide');
    });

    $('#markAttendanceButton').click(function() {
        $('#markAttendanceModal').modal('show');
    });

    $('#markAttendanceForm').submit(function(e) {
        e.preventDefault();
        let attendanceDateTime = $('#attendanceDateTime input').val();
        let attendanceStatus = $('#attendanceStatus').val();
        attendance[attendanceDateTime] = attendanceStatus;
        $('#studentTableBody tr').each(function() {
            let studentId = $(this).find('td:first').text();
            let subject = $(this).find('td:nth-child(3)').text();
            $(this).find('td:last').text(attendanceStatus + ' at ' + attendanceDateTime + ' for ' + subject);
        });
        $('#markAttendanceModal').modal('hide');
    });
    $('#viewAttendanceButton').click(function() {
        let attendanceHtml = '<table class="table table-striped"><thead><tr><th>Name</th><th>Subject</th><th>Attendance</th></tr></thead><tbody>';
        $('#studentTableBody tr').each(function() {
            let studentName = $(this).find('td:nth-child(2)').text();
            let subject = $(this).find('td:nth-child(3)').text();
            let attendanceStatus = $(this).find('td:last').text();
            attendanceHtml += '<tr><td>' + studentName + '</td><td>' + subject + '</td><td>' + attendanceStatus + '</td></tr>';
        });
        attendanceHtml += '</tbody></table>';
        $('#attendanceRecords').html(attendanceHtml);
        $('#attendanceView').show();
    });

    $('#exportToExcelButton').click(function() {
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Attendance');
        worksheet.addRow(['Student ID', 'Name', 'Subject', 'Attendance']);
        students.forEach(function(student) {
            worksheet.addRow([student.id, student.name, student.subject, attendance[Object.keys(attendance)[0]]]);
        });
        workbook.xlsx.writeBuffer()
            .then(function(buffer) {
                let blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                let link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'attendance.xlsx';
                link.click();
            });
    });

    $(function() {
        $('#attendanceDateTime').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss'
        });
    });

    let currentTime = moment().format('YYYY-MM-DD HH:mm');
    $('#attendanceDateTime input').val(currentTime);
});
