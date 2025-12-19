
CREATE DATABASE RentalDB;

USE RentalDB;


CREATE TABLE Employee (
    EmpID INT IDENTITY(1,1) PRIMARY KEY,
    EmpName VARCHAR(50) NOT NULL,
    EmpCountry VARCHAR(50) DEFAULT 'India',
    EmpAddress VARCHAR(100) NOT NULL,
    EmpContNo VARCHAR(20) UNIQUE,
    EmpSal DECIMAL(10,2) CHECK (EmpSal >= 0),
    JoinedDate DATE DEFAULT GETDATE()
);
insert into Employee values('Narruto','Japan','japan','789654125',48000,default)


-- Insert Employee Records
INSERT INTO Employee (EmpName, EmpAddress, EmpContNo, EmpSal)
VALUES 
('Amit Sharma', 'Delhi, India', '9876543210', 45000),
('Priya Verma', 'Mumbai, India', '9123456780', 52000),
('Rohit Singh', 'Bangalore, India', '9988776655', 60000),
('Sneha Kapoor', 'Chennai, India', '9012345678', 48000),
('Arjun Mehta', 'Kolkata, India', '9098765432', 55000);


CREATE TABLE Customers (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    CustName VARCHAR(50) NOT NULL,
    CustEmail VARCHAR(50) UNIQUE NOT NULL,
    CustPhone VARCHAR(20),
    CustAddress VARCHAR(75),
    CustDLNum VARCHAR(50) UNIQUE NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Insert Customers
INSERT INTO Customers (CustName, CustEmail, CustPhone, CustAddress, CustDLNum)
VALUES 
('John Doe', 'john.doe@example.com', '9876543210', '123 Main St, New York', 'DLNY12345'),
('Alice Smith', 'alice.smith@example.com', '555-0101', '45 Elm Street, CA', 'DLCA998877'),
('Bob Johnson', 'bob.j@example.com', '555-0102', '78 Oak Avenue, TX', 'DLTX112233'),
('Charlie Brown', 'charlie.b@example.com', '555-0103', '12 Pine Road, FL', 'DLFL445566'),
('Diana Prince', 'diana.p@example.com', '555-0104', '88 Justice Lane, DC', 'DLDC778899');


CREATE TABLE Vehicles (
    VehicleID INT IDENTITY(1,1) PRIMARY KEY,
    VehComp VARCHAR(50) NOT NULL,
    VehModel VARCHAR(50) NOT NULL,
    VehYear INT CHECK (VehYear >= 2010),
    VehNum VARCHAR(20) UNIQUE NOT NULL,
    VehType VARCHAR(30) CHECK (VehType IN ('Car','Bike')),
    VehRentRatePerDay DECIMAL(10,2) CHECK (VehRentRatePerDay > 0),
    VehMileage INT,
    VehAvai VARCHAR(20) DEFAULT 'Available',
    CreatedAt DATETIME DEFAULT GETDATE()
);

INSERT INTO Vehicles (VehComp, VehModel, VehYear, VehNum, VehType, VehRentRatePerDay, VehMileage)
VALUES
('Toyota', 'Corolla', 2022, 'ABC-1234', 'Car', 50, 15000),
('Honda', 'Civic', 2021, 'XYZ-5678', 'Car', 55, 22000),
('Yamaha', 'R15', 2022, 'BIKE-001', 'Bike', 30, 8000),
('Tesla', 'Model 3', 2024, 'ELC-7744', 'Car', 95, 1200),
('Royal Enfield', 'Classic 350', 2020, 'BIKE-002', 'Bike', 35, 15000);


--------------------------------------------------------
-- 5️⃣ CREATE TABLE: Rentals
--------------------------------------------------------
CREATE TABLE Rentals (
    RentalID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL,
    VehicleID INT NOT NULL,
    PickupDate DATETIME NOT NULL,
    ReturnDate DATETIME NOT NULL,
    ActualReturnDate DATETIME,
    RentTotAmt DECIMAL(10,2),
    RentalStatus VARCHAR(20)
        CHECK (RentalStatus IN ('Booked','Active','Completed','Cancelled'))
        DEFAULT 'Booked',

    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (VehicleID) REFERENCES Vehicles(VehicleID)
);

-- Insert Rental Data
INSERT INTO Rentals (CustomerID, VehicleID, PickupDate, ReturnDate, ActualReturnDate, RentTotAmt, RentalStatus)
VALUES 
(4, 5, '2025-10-15 09:00:00', '2025-10-16 09:00:00', '2025-10-16 09:30:00', 95, 'Completed');

CREATE TABLE Payments (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    RentalID INT NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    PayAmount DECIMAL(10,2),
    PaymentMethod VARCHAR(50),
    TransactionID VARCHAR(100),

    FOREIGN KEY (RentalID) REFERENCES Rentals(RentalID)
);

-- Insert Payment
INSERT INTO Payments (RentalID, PayAmount, PaymentMethod, TransactionID)
VALUES
(1, 200, 'Credit Card', 'TXN-CC-1001');

--------------------------------------------------------
-- View All The table
--------------------------------------------------------
select * from Employee
select * from Vehicles
select * from Rentals
select * from Payments


-- INNER JOIN
SELECT R.RentalID, C.CustName, V.VehModel, R.PickupDate, R.RentalStatus
FROM Rentals R
JOIN Customers C ON R.CustomerID = C.CustomerID
JOIN Vehicles V ON R.VehicleID = V.VehicleID;

-- LEFT JOIN
SELECT C.CustName, R.RentalID
FROM Customers C
LEFT JOIN Rentals R ON C.CustomerID = R.CustomerID;

-- RIGHT JOIN
SELECT V.VehModel, R.RentalID
FROM Rentals R
RIGHT JOIN Vehicles V ON R.VehicleID = V.VehicleID;

-- FULL OUTER JOIN
SELECT C.CustName, R.RentalID
FROM Customers C
FULL JOIN Rentals R ON C.CustomerID = R.CustomerID;


SELECT * FROM Vehicles WHERE VehYear BETWEEN 2020 AND 2024;
SELECT * FROM Customers WHERE CustName LIKE '%john%';
SELECT * FROM Vehicles WHERE VehType IN ('Bike');
SELECT * FROM Employee WHERE EmpSal > 50000;



-- Total Rentals per Customer
SELECT C.CustName, COUNT(R.RentalID) AS TotalRentals
FROM Customers C
LEFT JOIN Rentals R ON C.CustomerID = R.CustomerID
GROUP BY C.CustName;

-- Total Revenue
SELECT SUM(PayAmount) AS TotalRevenue FROM Payments;

-- Average Salary
SELECT AVG(EmpSal) AS AvgEmpSalary FROM Employee;


-- Vehicles with rent above average
SELECT *
FROM Vehicles
WHERE VehRentRatePerDay > (SELECT AVG(VehRentRatePerDay) FROM Vehicles);

-- Customers who never rented
SELECT *
FROM Customers
WHERE CustomerID NOT IN (SELECT CustomerID FROM Rentals);


-- View Available vehicles
CREATE VIEW vw_AvailableVehicles AS
SELECT * FROM Vehicles WHERE VehAvai = 'Available';
SELECT * FROM Vehicles WHERE VehAvai = 'rented';



-- INSERT
INSERT INTO Vehicles 
(VehComp, VehModel, VehYear, VehNum, VehType, VehRentRatePerDay, VehMileage)
VALUES ('Hyundai','i20',2023,'HY-2023','Car',60,12000);

-- UPDATE
UPDATE Vehicles SET VehAvai = 'Rented' WHERE VehicleID = 2;

-- DELETE (only if customer has no rentals)
DELETE FROM Customers 
WHERE CustomerID NOT IN (SELECT CustomerID FROM Rentals);


--Trigger: Vehicle → Rented (When Rental Created)
CREATE TRIGGER trg_VehicleRented_OnRentalInsert
ON Rentals
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Vehicles
    SET VehAvai = 'Rented'
    WHERE VehicleID IN (SELECT VehicleID FROM INSERTED);
END;
GO

--Trigger: Auto Payment (When Rental Completed)
CREATE TRIGGER trg_AutoPayment_OnRentalCompleted
ON Rentals
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Payments
    (
        RentalID,
        PayAmount,
        PaymentMethod,
        TransactionID,
        PaymentDate
    )
    SELECT
        i.RentalID,
        i.RentTotAmt,
        'Cash',
        CONCAT('TXN-', i.RentalID),
        GETDATE()
    FROM INSERTED i
    JOIN DELETED d ON i.RentalID = d.RentalID
    WHERE i.RentalStatus = 'Completed'
      AND d.RentalStatus IN ('Booked','Active');
END;
GO

-- Trigger: Vehicle → Available (On Rental Complete)
CREATE TRIGGER trg_VehicleAvailable_OnRentalCompleted
ON Rentals
AFTER UPDATE
AS
BEGIN
    UPDATE Vehicles
    SET VehAvai = 'Available'
    WHERE VehicleID IN (
        SELECT VehicleID FROM INSERTED WHERE RentalStatus = 'Completed'
    );
END;

--
INSERT INTO Rentals
(CustomerID, VehicleID, PickupDate, ReturnDate, RentTotAmt)
VALUES
(6, 7, GETDATE(), DATEADD(DAY, 1, GETDATE()), 720);

UPDATE Rentals
SET RentalStatus = 'Completed',
    ActualReturnDate = GETDATE()
WHERE RentalID = 1007; -- or correct ID

--
UPDATE Rentals
SET RentalStatus = 'Completed',
    ActualReturnDate = GETDATE()
WHERE RentalID = 2;

--
SELECT * FROM Rentals;
SELECT * FROM Payments;
SELECT * FROM Vehicles;
select * from Customers

SELECT RentalID, RentalStatus FROM Rentals;

DROP TRIGGER IF EXISTS trg_VehicleRented_OnRentalInsert;
DROP TRIGGER IF EXISTS trg_AutoPayment_OnRentalCompleted;
DROP TRIGGER IF EXISTS trg_VehicleAvailable_OnRentalCompleted;


