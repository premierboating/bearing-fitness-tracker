// One-time helper, already applied: it added the BearingWidgets target to App.xcodeproj without Xcode (npm install xcode, then node add_widget_target.js ../App/App.xcodeproj/project.pbxproj). Kept for the record.
// Adds the BearingWidgets extension target to the Capacitor Xcode project, the way Xcode's "New Target" would:
// sources, build settings, an Embed phase in the App target and the target dependency. Run once; it is a no-op afterwards.
const xcode = require('xcode'), fs = require('fs');
const file = process.argv[2];
const proj = xcode.project(file); proj.parseSync();
const NAME = 'BearingWidgets', BUNDLE = 'com.bengruver.bearing.BearingWidgets';
const objects = proj.hash.project.objects;
if (Object.values(objects.PBXNativeTarget).some(t => t && t.productType && String(t.productType).indexOf('app-extension') >= 0)) { console.log('extension target exists already'); process.exit(0); }
// the dependency helper only writes when these sections exist
objects.PBXTargetDependency = objects.PBXTargetDependency || {};
objects.PBXContainerItemProxy = objects.PBXContainerItemProxy || {};
const app = proj.getFirstTarget().uuid;
const target = proj.addTarget(NAME, 'app_extension', NAME, BUNDLE);
proj.addBuildPhase([], 'PBXSourcesBuildPhase', 'Sources', target.uuid);
proj.addBuildPhase([], 'PBXFrameworksBuildPhase', 'Frameworks', target.uuid);
proj.addBuildPhase([], 'PBXResourcesBuildPhase', 'Resources', target.uuid);
const group = proj.addPbxGroup([], NAME, NAME);
proj.addToPbxGroup(group.uuid, proj.getFirstProject().firstProject.mainGroup);
// files live in ios/App/BearingWidgets; the group carries the folder, so paths are bare names
proj.addSourceFile('BearingWidgets.swift', {target: target.uuid}, group.uuid);
proj.addSourceFile('RestActivityAttributes.swift', {target: target.uuid}, group.uuid);
// build settings, written straight onto the two new configurations
const common = {
  CODE_SIGN_STYLE: 'Automatic',
  CURRENT_PROJECT_VERSION: '1',
  GENERATE_INFOPLIST_FILE: 'NO',
  INFOPLIST_FILE: 'BearingWidgets/Info.plist',
  IPHONEOS_DEPLOYMENT_TARGET: '16.2',
  LD_RUNPATH_SEARCH_PATHS: '"$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks"',
  MARKETING_VERSION: '1.0',
  PRODUCT_BUNDLE_IDENTIFIER: BUNDLE,
  PRODUCT_NAME: '"$(TARGET_NAME)"',
  SKIP_INSTALL: 'YES',
  SWIFT_VERSION: '5.0',
  TARGETED_DEVICE_FAMILY: '"1,2"',
  VERSIONING_SYSTEM: '"apple-generic"',
};
const listUuid = target.pbxNativeTarget.buildConfigurationList;
for (const c of objects.XCConfigurationList[listUuid].buildConfigurations) {
  const cfg = objects.XCBuildConfiguration[c.value];
  cfg.buildSettings = Object.assign({}, common, cfg.name === 'Debug'
    ? {SWIFT_ACTIVE_COMPILATION_CONDITIONS: 'DEBUG', SWIFT_OPTIMIZATION_LEVEL: '"-Onone"', GCC_PREPROCESSOR_DEFINITIONS: ['"DEBUG=1"', '"$(inherited)"']}
    : {SWIFT_COMPILATION_MODE: 'wholemodule', SWIFT_OPTIMIZATION_LEVEL: '"-O"'});
}
// (addTarget already made the App target depend on the extension, since the dependency sections exist)
let text = proj.writeSync();
// tidy what the library leaves behind
text = text.replace(/LastSwiftUpdateCheck = 920;/, 'LastSwiftUpdateCheck = 0920;').replace(/LastUpgradeCheck = 920;/, 'LastUpgradeCheck = 0920;');
text = text.replace(/ (explicitFileType|fileEncoding|lastKnownFileType) = undefined;/g, '');
text = text.replace(/(lastKnownFileType = sourcecode\.swift;) includeInIndex = 0;/g, '$1');
text = text.replace(/\/\* BearingWidgets\.appex in Copy Files \*\/ = \{isa = PBXBuildFile; fileRef = ([A-F0-9]+) \/\* BearingWidgets\.appex \*\/; \}/, '/* BearingWidgets.appex in Embed Foundation Extensions */ = {isa = PBXBuildFile; fileRef = $1 /* BearingWidgets.appex */; settings = {ATTRIBUTES = (RemoveHeadersOnCopy, ); }; }');
text = text.replace(/name = "Copy Files";/, 'name = "Embed Foundation Extensions";');
fs.writeFileSync(file, text);
console.log('added target', target.uuid);
