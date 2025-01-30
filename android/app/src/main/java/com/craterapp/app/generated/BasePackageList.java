package com.craterapp.app.generated;

import java.util.Arrays;
import java.util.List;
import org.unimodules.core.interfaces.Package;

public class BasePackageList {
  public List<Package> getPackageList() {
    return Arrays.<Package>asList(
        new expo.modules.application.ApplicationPackage(),
        new expo.modules.constants.ConstantsPackage(),
        new expo.modules.device.DevicePackage(),
        new expo.modules.documentpicker.DocumentPickerPackage(),
        new expo.modules.errorrecovery.ErrorRecoveryPackage(),
        new expo.modules.filesystem.FileSystemPackage(),
        new expo.modules.font.FontLoaderPackage(),
        new expo.modules.imageloader.ImageLoaderPackage(),
        new expo.modules.imagepicker.ImagePickerPackage(),
        new expo.modules.intentlauncher.IntentLauncherPackage(),
        new expo.modules.keepawake.KeepAwakePackage(),
        new expo.modules.lineargradient.LinearGradientPackage(),
        new expo.modules.localauthentication.LocalAuthenticationPackage(),
        new expo.modules.localization.LocalizationPackage(),
        new expo.modules.splashscreen.SplashScreenPackage(),
        new expo.modules.storereview.StoreReviewPackage(),
        new expo.modules.updates.UpdatesPackage()
    );
  }
}
