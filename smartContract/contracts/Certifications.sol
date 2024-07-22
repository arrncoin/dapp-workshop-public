// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Certifications {
    uint256 certificationsAmount = 0;

    // Define the data type
    struct Student {
        uint256 id;
        string email;
        string name;
        uint256 createdAt;
        bool isValid;
    }

    // Define the events type
    event CertificationCreatedEvent(
        uint256 id,
        string email,
        string name,
        uint256 createdAt,
        bool isValid
    );
    event CertificationUpdatedEvent(uint256 id, bool updated);

    // Create the map with the list of certifications (Create operation)
    mapping(uint256 => Student) public certificationList;

    // _name means that name is a private variable
    function createCertification(
        uint256 _id,
        string memory _name,
        string memory _email
    ) public {
        certificationList[_id] = Student(
            _id,
            _email,
            _name,
            block.timestamp,
            true // When the certification is created, is valid
        );
        emit CertificationCreatedEvent(
            _id,
            _email,
            _name,
            block.timestamp,
            true
        );
    }

    // Invalid a certification (Update operation)
    function invalidContrat(uint256 _id) public {
        Student memory _student = certificationList[_id];
        _student.isValid = false;
        certificationList[_id] = _student;
        emit CertificationUpdatedEvent(_id, true);
    }

    // Get contract by Id (Get operation)
    function getCertification(
        uint256 _id
    )
        public
        view
        returns (
            uint256 id,
            string memory email,
            string memory name,
            uint256 createdAt,
            bool isValid
        )
    {
        Student memory student = certificationList[_id];
        return (
            student.id,
            student.email,
            student.name,
            student.createdAt,
            student.isValid
        );
    }
}
