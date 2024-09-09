SELECT
  va.ArticulationType,
  cif.PublishedCode,
  pc.outline_id,
  va.AceID,
  va.TeamRevd,
  va.Exhibit,
  s.subject + ' ' + cif.course_number + ' - ' + cif.course_title AS CourseTitle,
  moc.Occupation,
  va.Title,
  pif.program + ' - ' + CAST(pif.description AS VARCHAR(10)) AS program,
  CASE
    WHEN pc.group_desc <> '' THEN CAST(pc.group_units_min AS VARCHAR(4)) + ' - ' + CAST(pc.group_units_max AS VARCHAR(4))
    ELSE CAST(pc.vunits AS VARCHAR(4))
  END AS vunits,
  pc.program_id,
  cif.college_id
FROM
  dbo.ViewArticulations AS va
  JOIN dbo.View_MostCurrentOccupation AS moc ON va.Occupation = moc.Occupation
  LEFT JOIN (
    SELECT
      Occupation,
      college_id
    FROM
      dbo.ViewPublishedOccupations
  ) AS vpo ON va.Occupation = vpo.Occupation
  JOIN dbo.tblProgramCourses AS pc ON va.outline_id = pc.outline_id
  JOIN dbo.Course_IssuedForm AS cif ON pc.outline_id = cif.outline_id
  JOIN dbo.tblSubjects AS s ON cif.subject_id = s.subject_id
  JOIN dbo.Program_IssuedForm AS pif ON pc.program_id = pif.program_id
WHERE
  (va.ArticulationType = 'Occupation')
  AND cif.college_id = 1
  AND pif.college_id = 1;