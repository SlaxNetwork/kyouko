-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "profileSettingsId" INTEGER NOT NULL,
    "cookieClickerProfileId" INTEGER,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileSettings" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en_us',

    CONSTRAINT "ProfileSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CookieClickerProfile" (
    "id" SERIAL NOT NULL,
    "cookies" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CookieClickerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_key" ON "Profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileSettings_id_key" ON "ProfileSettings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CookieClickerProfile_id_key" ON "CookieClickerProfile"("id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_profileSettingsId_fkey" FOREIGN KEY ("profileSettingsId") REFERENCES "ProfileSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_cookieClickerProfileId_fkey" FOREIGN KEY ("cookieClickerProfileId") REFERENCES "CookieClickerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
