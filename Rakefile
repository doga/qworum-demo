# Rakefile
# Doc for fileutils: https://ruby-doc.org/stdlib-2.7.2/libdoc/fileutils/rdoc/index.html

# Before publishing to GitHub, run `rake build` in test mode, and then commit.
MODE='test' 
# MODE='production'

task default: :help

desc 'Show available Rake tasks'
task :help do
    sh "rake -T"
end

desc 'Build the websites'
# task :build do
task build: [:clear_build, :get_qworum_module_for_web_pages] do
  # sh "cp -r src/* build"
  cp_r Dir.glob('src/websites/*'), 'build'
  Dir.glob 'build/*' do |dir|
    puts "dir: #{dir}"

    # adjust urls to the current mode (test or production)
    if MODE == 'test'
      cp 'src/website-urls/test.mjs', "#{dir}/_assets/js/modules/website-urls.mjs"
    else
      cp 'src/website-urls/production.mjs', "#{dir}/_assets/js/modules/website-urls.mjs"
    end

    # add the newest version of the Qworum module to the websites
    cp 'src/qworum-for-web-pages/qworum-for-web-pages.mjs', "#{dir}/_assets/js/modules/qworum"
  end
end

desc "Get the latest version of qworum-for-web-pages.mjs (only works on the author's computer)"
task :get_qworum_module_for_web_pages do
  begin
    cp '../../qworum-for-web-pages/qworum-for-web-pages.mjs', "src/qworum-for-web-pages"
  rescue
  end
end

desc 'Empty the build directory'
task :clear_build do
  begin
    sh "trash build/*"
  rescue
  end
end
