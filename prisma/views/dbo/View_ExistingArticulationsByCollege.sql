SELECT
  TOP (100) PERCENT lc.College,
  CASE
    WHEN s.[order] = 1 THEN 'Initiator'
    WHEN s.[order] = 2 THEN 'Faculty'
    WHEN s.[order] = 3 THEN 'Articulation Officer'
    ELSE 'Implementation'
  END AS Stage,
  su.subject,
  cif.course_number,
  cif.course_title,
  aec.CriteriaDescription,
  ae.AceID,
  ae.TeamRevd,
  ae.VersionNumber,
  aso.Description AS ArticulationSource,
  CASE
    WHEN a.Articulate = 1 THEN 'Approved'
    ELSE 'Denied'
  END AS ArticulationStatus,
  cif.CIDNumber,
  a.CreatedOn
FROM
  dbo.Articulation AS a
  JOIN dbo.Stages AS s ON a.ArticulationStage = s.Id
  AND a.CollegeID = s.CollegeId
  JOIN dbo.Course_IssuedForm AS cif ON a.outline_id = cif.outline_id
  JOIN dbo.tblSubjects AS su ON cif.subject_id = su.subject_id
  AND cif.college_id = su.college_id
  JOIN dbo.tblLookupUnits AS u ON cif.unit_id = u.unit_id
  JOIN dbo.LookupColleges AS lc ON a.CollegeID = lc.CollegeID
  JOIN dbo.ACEExhibit AS ae ON a.ExhibitID = ae.ID
  JOIN dbo.ACEExhibitCriteria AS aec ON a.CriteriaID = aec.CriteriaID
  JOIN dbo.ArticulationSource AS aso ON a.SourceID = aso.ID
ORDER BY
  lc.College,
  s.[Order],
  su.subject,
  cif.course_number;