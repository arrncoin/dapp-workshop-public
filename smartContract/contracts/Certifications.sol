// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Certifications is Ownable {
    uint256 private certificationsCount = 0;

    constructor(address initialOwner) Ownable(initialOwner) {}

    struct Certificate {
        bytes32 id;
        string email;
        string name;
        uint256 createdAt;
        bool isValid;
        string universityName;
        string courseName;
        uint16 hoursAmount;
    }

    event CertificationCreatedEvent(
        bytes32 id,
        string email,
        string name,
        uint256 createdAt,
        bool isValid,
        string universityName,
        string courseName,
        uint16 hoursAmount
    );

    event CertificationUpdatedEvent(bytes32 id, bool isValid);

    mapping(bytes32 => Certificate) private certificationList;

    function generateUUID() internal view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    msg.sender,
                    certificationsCount
                )
            );
    }

    function createCertification(
        string memory _name,
        string memory _email,
        string memory _universityName,
        string memory _courseName,
        uint16 _hoursAmount
    ) public onlyOwner {
        bytes32 _id = generateUUID();
        certificationsCount++;
        certificationList[_id] = Certificate(
            _id,
            _email,
            _name,
            block.timestamp,
            true,
            _universityName,
            _courseName,
            _hoursAmount
        );
        emit CertificationCreatedEvent(
            _id,
            _email,
            _name,
            block.timestamp,
            true,
            _universityName,
            _courseName,
            _hoursAmount
        );
    }

    function invalidateCertification(bytes32 _id) public onlyOwner {
        require(
            certificationList[_id].id != bytes32(0),
            "Invalid certificate ID"
        );
        Certificate storage _certificate = certificationList[_id];
        require(_certificate.isValid, "Certificate is already invalid");
        _certificate.isValid = false;
        emit CertificationUpdatedEvent(_id, false);
    }

    function getCertification(
        bytes32 _id
    )
        public
        view
        returns (
            bytes32 id,
            string memory email,
            string memory name,
            uint256 createdAt,
            bool isValid,
            string memory universityName,
            string memory courseName,
            uint16 hoursAmount
        )
    {
        require(
            certificationList[_id].id != bytes32(0),
            "Invalid certificate ID"
        );
        Certificate memory certificate = certificationList[_id];
        return (
            certificate.id,
            certificate.email,
            certificate.name,
            certificate.createdAt,
            certificate.isValid,
            certificate.universityName,
            certificate.courseName,
            certificate.hoursAmount
        );
    }
}
