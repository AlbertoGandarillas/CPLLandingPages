SELECT
  pc.programcourse_id,
  pc.program_id,
  pc.outline_id,
  pc.required,
  pc.Articulate,
  pc.isuborder,
  pc.iorder,
  pc.or_group,
  pc.c_group,
  pc.group_desc,
  pc.group_units,
  CASE
    WHEN pc.group_desc <> '' THEN CAST(pc.group_units_min AS VARCHAR(4)) + ' - ' + CAST(pc.group_units_max AS VARCHAR(4))
    ELSE CAST(pc.vunits AS VARCHAR(4))
  END AS vunits,
  pc.icross,
  pc.condition,
  pc.semester,
  p.college_id,
  s.subject,
  cif.course_number,
  cif.course_title,
  ct.description AS course_type,
  dbo.ProgramMatrixTotalGroup(pc.programcourse_id) AS group_total,
  dbo.TotalCoursePreRequisites(pc.outline_id) AS prereq_total
FROM
  dbo.tblProgramCourses AS pc
  JOIN dbo.Program_IssuedForm AS p ON pc.program_id = p.program_id
  LEFT JOIN dbo.Course_IssuedForm AS cif ON pc.outline_id = cif.outline_id
  LEFT JOIN dbo.tblSubjects AS s ON cif.subject_id = s.subject_id
  LEFT JOIN dbo.tblLookupCourseType AS ct ON pc.required = ct.id;