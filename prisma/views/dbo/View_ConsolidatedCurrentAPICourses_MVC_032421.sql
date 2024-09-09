SELECT
  COLLEGECODE AS [EntityCollegeCode],
  COLLEGETITLE AS [EntityCollegeTitle],
  a.[EntityID],
  eNTITYCOURSETITLE AS [EntityTitle],
  LASTUPDATED AS [EntityLastUpdated],
  STATUS AS [EntityStatus],
  [EntityCourseTitle],
  [EntityCourseShortTitle],
  [EntityCourseNumber],
  [EntityCourseDescription],
  [EntityCourseShortDescription],
  IMPLEMENTATIONDATE AS [EntityImplementationDate],
  [EntitySubject],
  [EntityActionType],
  [Semester],
  [Min_Semester_Units] AS MinUnits,
  [min_semester_units] AS [MaxUnits],
  [RecommendedTOPSCodeValue],
  [RecommendedTOPSCodeDisplay],
  a.InsertDate
FROM
  [dbo].[CU_Course_API] AS A
  JOIN CU_CourseUnitsHours_API AS B ON A.EntityID = B.EntityID
  JOIN CU_CourseCampus_API AS cc ON a.EntityID = cc.EntityID
  AND cc.CampusID = 2
  AND STATUS IN ('active', 'approved');