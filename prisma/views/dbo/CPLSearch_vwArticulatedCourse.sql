SELECT
  DISTINCT Ace.ID,
  A.AceID,
  Ace.TeamRevd,
  Ace.StartDate,
  Ace.EndDate,
  A.CollegeID,
  CodeType = CASE
    WHEN a.ArticulationType = 1 THEN 'ACE'
    ELSE 'MOS'
  END,
  CF.[course_number],
  CF.[course_title],
  Su.SubjectName,
  Su.subject,
  U.Unit,
  IsApproved = CASE
    WHEN s.[Order] = 4 THEN 1
    ELSE 0
  END
FROM
  AceExhibit AS Ace
  JOIN Articulation AS A ON Ace.AceID = A.AceID
  AND Ace.TeamRevd = A.TeamRevd
  JOIN ArticulationCriteria AS AC ON a.ArticulationID = ac.ArticulationID
  JOIN Stages AS S ON A.ArticulationStage = S.ID
  AND A.CollegeID = S.CollegeId
  AND a.Articulate = 1
  JOIN Course_IssuedForm AS CF ON A.outline_id = CF.outline_id
  AND A.CollegeID = CF.college_id
  AND CF.status = 0
  JOIN tblLookupUnits AS U ON CF.unit_id = U.unit_id
  JOIN tblSubjects AS Su ON CF.subject_id = Su.subject_id
WHERE
  A.Articulate = 1
  AND s.[Order] = 4;