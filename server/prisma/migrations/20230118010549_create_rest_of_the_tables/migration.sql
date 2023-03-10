-- CreateTable
CREATE TABLE "habit_week_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habitID" TEXT NOT NULL,
    "weekDay" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "day_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "habitId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "habit_week_days_habitID_weekDay_key" ON "habit_week_days"("habitID", "weekDay");

-- CreateIndex
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");

-- CreateIndex
CREATE UNIQUE INDEX "day_habits_dayId_habitId_key" ON "day_habits"("dayId", "habitId");
