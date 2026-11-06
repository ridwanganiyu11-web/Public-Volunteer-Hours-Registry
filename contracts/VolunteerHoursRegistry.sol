// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VolunteerHoursRegistry
 * @notice VolunChain — Every Hour Counts. Every Contribution Matters.
 * @dev Lightweight registry allowing registered organizations to create volunteer
 *      activities and record verifiable volunteer hours on Botchain Testnet (Chain ID 968).
 *      Only the organization that created an activity can record hours for that activity.
 */
contract VolunteerHoursRegistry {
    struct Organization {
        address wallet;
        string name;
        string description;
        uint256 registeredAt;
        bool isRegistered;
    }

    struct Activity {
        uint256 id;
        address organization;
        string organizationName;
        string name;
        string description;
        string location;
        uint256 createdAt;
        bool exists;
    }

    struct VolunteerRecord {
        uint256 id;
        uint256 activityId;
        address organization;
        string organizationName;
        string activityName;
        address volunteer;
        string volunteerName;
        uint256 hoursCompleted;
        string dateRecorded;
        uint256 timestamp;
        bool exists;
    }

    uint256 public nextActivityId = 1;
    uint256 public nextRecordId = 1;

    mapping(address => Organization) public organizations;
    address[] public organizationAddresses;

    mapping(uint256 => Activity) public activities;
    uint256[] public activityIds;
    mapping(address => uint256[]) private organizationActivityIds;

    mapping(uint256 => VolunteerRecord) public records;
    uint256[] public recordIds;
    mapping(address => uint256[]) private volunteerRecordIds;
    mapping(address => uint256[]) private organizationRecordIds;
    mapping(address => uint256) private volunteerTotalHours;

    event OrganizationRegistered(
        address indexed organization,
        string name,
        string description,
        uint256 timestamp
    );

    event ActivityCreated(
        uint256 indexed activityId,
        address indexed organization,
        string organizationName,
        string name,
        string location,
        uint256 timestamp
    );

    event HoursRecorded(
        uint256 indexed recordId,
        uint256 indexed activityId,
        address indexed volunteer,
        address organization,
        string volunteerName,
        uint256 hoursCompleted,
        string dateRecorded,
        uint256 timestamp
    );

    error AlreadyRegistered();
    error NotRegisteredOrganization();
    error ActivityNotFound();
    error UnauthorizedOrganization();
    error InvalidInput();

    modifier onlyRegisteredOrg() {
        if (!organizations[msg.sender].isRegistered) {
            revert NotRegisteredOrganization();
        }
        _;
    }

    /**
     * @notice Register or update an organization profile for msg.sender
     * @param name The public display name of the organization
     * @param description Brief mission statement or category
     */
    function registerOrganization(
        string calldata name,
        string calldata description
    ) external {
        if (bytes(name).length == 0) revert InvalidInput();

        bool alreadyExists = organizations[msg.sender].isRegistered;
        organizations[msg.sender] = Organization({
            wallet: msg.sender,
            name: name,
            description: description,
            registeredAt: alreadyExists ? organizations[msg.sender].registeredAt : block.timestamp,
            isRegistered: true
        });

        if (!alreadyExists) {
            organizationAddresses.push(msg.sender);
        }

        emit OrganizationRegistered(msg.sender, name, description, block.timestamp);
    }

    /**
     * @notice Create a new volunteer activity under the caller's registered organization
     * @param name Title of the volunteer activity
     * @param description Details about what volunteers will do
     * @param location Location or date label for the activity
     */
    function createActivity(
        string calldata name,
        string calldata description,
        string calldata location
    ) external onlyRegisteredOrg returns (uint256 activityId) {
        if (bytes(name).length == 0) revert InvalidInput();

        activityId = nextActivityId++;
        Organization storage org = organizations[msg.sender];

        activities[activityId] = Activity({
            id: activityId,
            organization: msg.sender,
            organizationName: org.name,
            name: name,
            description: description,
            location: location,
            createdAt: block.timestamp,
            exists: true
        });

        activityIds.push(activityId);
        organizationActivityIds[msg.sender].push(activityId);

        emit ActivityCreated(
            activityId,
            msg.sender,
            org.name,
            name,
            location,
            block.timestamp
        );
    }

    /**
     * @notice Record completed volunteer hours for a specific activity
     * @dev Only the organization wallet that created the activity may record hours for it
     * @param activityId ID of the activity created by msg.sender
     * @param volunteer Wallet address of the volunteer
     * @param volunteerName Optional display name of the volunteer (for certificate generation)
     * @param hoursCompleted Number of hours completed (must be > 0)
     * @param dateRecorded Human-readable date string (e.g., "2026-11-06")
     */
    function recordVolunteerHours(
        uint256 activityId,
        address volunteer,
        string calldata volunteerName,
        uint256 hoursCompleted,
        string calldata dateRecorded
    ) external onlyRegisteredOrg returns (uint256 recordId) {
        Activity storage act = activities[activityId];
        if (!act.exists) revert ActivityNotFound();
        if (act.organization != msg.sender) revert UnauthorizedOrganization();
        if (volunteer == address(0) || hoursCompleted == 0) revert InvalidInput();

        recordId = nextRecordId++;

        records[recordId] = VolunteerRecord({
            id: recordId,
            activityId: activityId,
            organization: msg.sender,
            organizationName: organizations[msg.sender].name,
            activityName: act.name,
            volunteer: volunteer,
            volunteerName: volunteerName,
            hoursCompleted: hoursCompleted,
            dateRecorded: dateRecorded,
            timestamp: block.timestamp,
            exists: true
        });

        recordIds.push(recordId);
        volunteerRecordIds[volunteer].push(recordId);
        organizationRecordIds[msg.sender].push(recordId);
        volunteerTotalHours[volunteer] += hoursCompleted;

        emit HoursRecorded(
            recordId,
            activityId,
            volunteer,
            msg.sender,
            volunteerName,
            hoursCompleted,
            dateRecorded,
            block.timestamp
        );
    }

    /**
     * @notice View a volunteer's cumulative verified hours
     */
    function getVolunteerHours(address volunteer) external view returns (uint256) {
        return volunteerTotalHours[volunteer];
    }

    /**
     * @notice View all verified contribution records for a volunteer
     */
    function getVolunteerRecords(
        address volunteer
    ) external view returns (VolunteerRecord[] memory) {
        uint256[] storage ids = volunteerRecordIds[volunteer];
        VolunteerRecord[] memory result = new VolunteerRecord[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = records[ids[i]];
        }
        return result;
    }

    /**
     * @notice View details of a single volunteer activity
     */
    function getActivity(uint256 activityId) external view returns (Activity memory) {
        if (!activities[activityId].exists) revert ActivityNotFound();
        return activities[activityId];
    }

    /**
     * @notice View details of a single volunteer hour record
     */
    function getRecord(uint256 recordId) external view returns (VolunteerRecord memory) {
        return records[recordId];
    }

    /**
     * @notice View all activities created by a specific organization
     */
    function getOrganizationActivities(
        address org
    ) external view returns (Activity[] memory) {
        uint256[] storage ids = organizationActivityIds[org];
        Activity[] memory result = new Activity[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = activities[ids[i]];
        }
        return result;
    }

    /**
     * @notice View all records submitted by a specific organization
     */
    function getOrganizationRecords(
        address org
    ) external view returns (VolunteerRecord[] memory) {
        uint256[] storage ids = organizationRecordIds[org];
        VolunteerRecord[] memory result = new VolunteerRecord[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = records[ids[i]];
        }
        return result;
    }

    /**
     * @notice Return all registered organizations
     */
    function getAllOrganizations() external view returns (Organization[] memory) {
        Organization[] memory result = new Organization[](organizationAddresses.length);
        for (uint256 i = 0; i < organizationAddresses.length; i++) {
            result[i] = organizations[organizationAddresses[i]];
        }
        return result;
    }

    /**
     * @notice Return all created activities
     */
    function getAllActivities() external view returns (Activity[] memory) {
        Activity[] memory result = new Activity[](activityIds.length);
        for (uint256 i = 0; i < activityIds.length; i++) {
            result[i] = activities[activityIds[i]];
        }
        return result;
    }

    /**
     * @notice Return all recorded volunteer contributions
     */
    function getAllRecords() external view returns (VolunteerRecord[] memory) {
        VolunteerRecord[] memory result = new VolunteerRecord[](recordIds.length);
        for (uint256 i = 0; i < recordIds.length; i++) {
            result[i] = records[recordIds[i]];
        }
        return result;
    }
}

