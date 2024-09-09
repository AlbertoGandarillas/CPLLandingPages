SELECT
  u.collegeid,
  college,
  FirstName,
  LastName,
  email,
  u.RoleID,
  ru.isAdministrator,
  ru.RoleName,
  u.UserName
FROM
  TBLUSERS AS u
  JOIN LookupColleges AS c ON u.CollegeID = c.CollegeID
  LEFT JOIN ROLES AS ru ON u.roleid = ru.roleid
WHERE
  u.collegeid > 3
  AND lastname <> 'campos';