SELECT
  DISTINCT s.subject + ' ' + cif.course_number + ' - ' + cif.course_title AS 'CourseTitle',
  u.unit AS vunits,
  vl.ID AS 'LeadID'
FROM
  CollegeCourseOccupations AS cco
  JOIN MostCurrentACEOccupation AS mco ON cco.AceID = mco.AceID
  AND cco.TeamRevd = mco.TeamRevd
  JOIN veteran AS v ON mco.Occupation = v.Occupation
  JOIN VeteranLead AS vl ON vl.VeteranID = v.id
  JOIN Campaign AS c ON vl.CampaignID = c.ID
  JOIN Course_IssuedForm AS cif ON cco.outline_id = cif.outline_id
  JOIN tblSubjects AS s ON cif.subject_id = s.subject_id
  JOIN tblLookupUnits AS u ON cif.unit_id = u.unit_id
WHERE
  cco.ArticulationStatus = 2
  AND c.CampaignStatus = 1;