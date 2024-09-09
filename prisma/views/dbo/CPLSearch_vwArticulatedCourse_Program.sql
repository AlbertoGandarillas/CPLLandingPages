SELECT
  DISTINCT Ace.ID,
  A.AceID,
  Ace.TeamRevd,
  Ace.StartDate,
  Ace.EndDate,
  A.CollegeID,
  CodeType = CASE
    WHEN ArticulationType = 1 THEN 'ACE'
    ELSE 'MOS'
  END,
  CF.[course_number],
  CF.[course_title],
  Su.SubjectName,
  Su.subject,
  PF.program,
  ProgramID = PF.program_id,
  shortprogram = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(Program, 'Management', 'Mgmt'),
              'Administration',
              'Admin'
            ),
            'Business',
            'Bus.'
          ),
          'Mgmtconcentration',
          'Mgmt'
        ),
        'Technology',
        'Tech'
      ),
      'Information',
      'Info'
    ),
    'Manufacturing',
    'Manuf'
  ) + ' - ' + CAST(PF.program_id AS VARCHAR),
  Units = CAST(ISNULL(unit, 0) AS DECIMAL(9, 2)),
  UnitsRequired = CAST(ISNULL(ifp1.propertyvalue, 0) AS DECIMAL(18, 1)),
  IsApproved = CASE
    WHEN s.[Order] = 4 THEN 1
    ELSE 0
  END
FROM
  AceExhibit AS Ace
  JOIN Articulation AS A ON Ace.AceID = A.AceID
  AND Ace.TeamRevd = A.TeamRevd
  JOIN Stages AS S ON A.ArticulationStage = S.ID
  AND A.CollegeID = S.CollegeId
  AND a.Articulate = 1
  JOIN Course_IssuedForm AS CF ON A.outline_id = CF.outline_id
  AND A.CollegeID = CF.college_id
  AND CF.status = 0
  JOIN tblLookupUnits AS U ON CF.unit_id = U.unit_id
  JOIN tblSubjects AS Su ON CF.subject_id = Su.subject_id
  JOIN tblProgramCourses AS PC ON CF.outline_id = PC.outline_id
  JOIN Program_IssuedForm AS PF ON PC.program_id = PF.program_id
  AND pf.status = 0
  JOIN dbo.issuedformproperties AS ifp1 ON PF.issuedformid = ifp1.issuedformid
  AND propertyname = 'MinimumUnits'
WHERE
  A.Articulate = 1
  AND s.[Order] = 4;