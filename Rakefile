# Rakefile
# Doc for fileutils: https://ruby-doc.org/stdlib-2.7.2/libdoc/fileutils/rdoc/index.html

# Before publishing to GitHub, run `rake build` in test mode, and then commit.
MODES = [:test, :production]
MODE= MODES.first
# MODE= MODES.last

task default: :help

desc 'Show available Rake tasks'
task help: [:show_mode] do
    sh "rake -T"
end

URLS = {
  production: {
    shop: 'https://shop.demo.qworum.net',
    cart: 'https://cart.demo.qworum.net',
    payments: 'https://payments.demo.qworum.net'
  },
  test: {
    shop: '/build/shop.demo.qworum.net',
    cart: '/build/cart.demo.qworum.net',
    payments: '/build/payments.demo.qworum.net'
  }
}

require 'pathname'

desc 'Build the websites'
task build: [:clear_build, :get_qworum_module_for_web_pages] do
  # copy raw files from src to build
  cp_r Dir.glob('src/websites/*'), 'build'

  # set the website urls in script files
  Dir.glob 'build/*/**/*.{js,mjs,qrm.xml}' do |filename|
    # puts "file: #{filename}"

    file = Pathname.new filename
    urls = URLS[MODE]
    output = []

    # output = file.readlines.filter do |line|
    #   line.index('$shop') or line.index('$cart') or line.index('$payments')
    # end
    # puts "#{output.size} lines to modify" 

    file.readlines.each do |line|
      output << line.gsub('@@shop', urls[:shop]).gsub('@@cart', urls[:cart]).gsub('@@payments', urls[:payments])
    end
    file.write output.join('')
  end

  # add the newest version of the Qworum module to the websites
  Dir.glob 'build/*' do |dir|
    # puts "dir: #{dir}"
    cp 'src/qworum-for-web-pages/qworum-for-web-pages.mjs', "#{dir}/_assets/js/modules/qworum"
  end

  sh "date"
end

desc "Get the latest version of qworum-for-web-pages.mjs. (To make this work, copy this project to your computer in an appropriate directory: https://github.com/doga/qworum-for-web-pages)"
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

desc "Show the mode (#{MODES.join ' or '})"
task :show_mode do
    puts "Mode: #{MODE} (edit Rakefile to switch between #{MODES.join ' and '})"
end
