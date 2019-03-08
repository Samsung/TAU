#!/usr/bin/python
import os, sys, subprocess, shutil


cwd=os.getcwd()
tempdir=cwd+"/_temp"
gitaccount=""


if(len(sys.argv) > 1):
	gitaccount=sys.argv[1]

if "" == gitaccount:
	print("No git account is given")
	sys.exit(1)


def cmd(command):
	return subprocess.call(command.split())

class Git:
	addr=""
	branch=""

class SrcDest:
	def __init__(self, pathFrom, pathTo):
		self.src=pathFrom
		self.dest=pathTo

class Job:
	def __init__(self, srcgit, destgit, fromtolist, preprocess):
		self.srcgit=srcgit
		self.destgit=destgit
		self.fromtolist=fromtolist
		self.preprocess = preprocess

# Git info
class webuifw(Git):
	addr="165.213.149.219:29418/magnolia/framework/web/web-ui-fw"
	branch="devel/webappfw/tau"

class webapp(Git):
	addr="slp-info.sec.samsung.net:29418/tizenw/sdk-web-apps"
	branch="devel/webappfw/tizenw"

class sdk(Git):
	addr="121.133.176.96:29429/profile/tizenw/sdk/web-ide-resources"
	branch="gear_1.0"


# job list
jobs = {
	"1_template": Job(
		webuifw,
		sdk,
		[
			SrcDest("tau/demos/TemplateBasic", "samples/web/Template/Tizen/Gear\ UI/Basic/project"),
			SrcDest("tau/demos/TemplateList", "samples/web/Template/Tizen/Gear\ UI/List/project"),
			SrcDest("tau/demos/WearableWidgetSample", "samples/web/Sample/Tizen/Web\ App/WearableWidgets/project")
		], None),
	"2_gearui_sdk": Job(
		webuifw,
		sdk,
		[
			SrcDest("tau/dist/wearable", "samples/web/Template/Tizen/Gear\ UI/Basic/project/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "samples/web/Template/Tizen/Gear\ UI/List/project/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "samples/web/Sample/Tizen/Web\ App/WearableWidgets/project/lib/tau/wearable")
		], ["cd web-ui-fw/tau", "grunt"]),
	"3_gearui_webapp": Job(
		webuifw,
		webapp,
		[
			SrcDest("tau/dist/wearable", "Calendar/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "Camera/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "DigitalAlarmLED/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "MediaControl/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "Evernote/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "QRCodeReader/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "ScanAndPlay/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "ShoppingList/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "TouchPaint/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "WatchOnWeb/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "Weather/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "Pedometer/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "Camera/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "StopWatch/lib/tau/wearable"),
		], ["cd web-ui-fw/tau", "grunt"])

}

def cloneGit(git, targetdir):
	cwd=os.getcwd()
	os.chdir(targetdir)

	localpath=os.path.basename(git.addr)

	if not os.path.isdir(localpath):
		cmd("git clone ssh://"+gitaccount+"@"+git.addr)
		os.chdir(localpath)
		cmd("git fetch origin "+git.branch+":"+git.branch)
		cmd("git checkout "+git.branch)
	else:
		pass
		os.chdir(localpath)
		cmd("git fetch origin")
		cmd("git checkout "+git.branch)
		cmd("git rebase origin/"+git.branch)
	cmd("cp "+cwd+"/../../tau/commit-msg .git/hooks/")
	os.chdir(cwd)


def main():
	global tempdir

	if os.path.isdir(tempdir):
		cmd("rm -rf "+tempdir)
	os.mkdir(tempdir)
	os.chdir(tempdir)

	for k in sorted(jobs.keys()):
		print("Run job: %s"%(k))
		job = jobs[k]

		# Clone src and dest git
		for git in [job.srcgit, job.destgit]:
			cloneGit(git, tempdir)

		# Preprocess
		if job.preprocess:
			for c in job.preprocess:
				if c.split()[0] == "cd":
					os.chdir(c.split()[1])
				else:
					cmd(c)
			os.chdir(tempdir)

		# update all dirs
		os.chdir(tempdir)
		for srcdest in job.fromtolist:
			srcdir = os.path.join(os.path.basename(job.srcgit.addr), srcdest.src).replace("\\", "")
			destdir = os.path.join(os.path.basename(job.destgit.addr), srcdest.dest).replace("\\", "")
			print("copy %s* to %s"%(srcdir, destdir))
			#cmd("cp -a %s/* %s/"%(srcdir, destdir))
			#cmd("rm -rf " + destdir)
			if os.path.isdir(destdir):
				shutil.rmtree(destdir)
			elif os.path.islink(destdir):
				os.remove( destdir )
			parentDestDir = os.path.dirname(destdir)
			if not os.path.isdir(parentDestDir):
				if os.path.islink(parentDestDir):
					os.unlink(parentDestDir)
				else:
					os.remove(parentDestDir)
				os.makedirs(parentDestDir)
			shutil.copytree( srcdir, destdir, symlinks=True)

	os.chdir(cwd)
if __name__ == "__main__":
	main()
