# Rakefile
# Doc for fileutils: https://ruby-doc.org/stdlib-2.7.2/libdoc/fileutils/rdoc/index.html

# Before publishing to GitHub, run `rake build` in test mode, and then commit.

task default: :help

desc 'Show available Rake tasks'
task :help do
    sh "rake -T"
end


# Build the Qworum services for dev or for production?
# APP_MODE = :development
APP_MODE= :production

# Determines which Qworum js library to use.
# If APP_MODE == :production then LIB_MODE == :production is assumed, regardless of the actual value of LIB_MODE.
# LIB_MODE = :development
LIB_MODE = :production

PLACEHOLDER_VALUES = {
  production: {
    shop:     'https://shop.demo.qworum.net',
    cart:     'https://cart.demo.qworum.net',
    payments: 'https://payments.demo.qworum.net',
    library:  'https://cdn.skypack.dev/@qworum/qworum-for-web-pages@1.0.11' # always used if APP_MODE == :production
  },
  development: {
    shop:     '/build/shop.demo.qworum.net',
    cart:     '/build/cart.demo.qworum.net',
    payments: '/build/payments.demo.qworum.net',
    library:  './modules/qworum/qworum-for-web-pages.mjs' # not used if APP_MODE == :production
  }
}

require 'pathname'

desc 'Build the websites'
task build: [:clear_build, :show_params] do
# task build: [:clear_build, :get_qworum_module_for_web_pages] do

  # copy raw files from src to build
  cp_r Dir.glob('src/websites/*'), 'build'

  # Replace the placeholder strings in script files
  Dir.glob 'build/*/**/*.{js,mjs,qrm.xml}' do |filename|
    # puts "file: #{filename}"
    shop     = PLACEHOLDER_VALUES[APP_MODE][:shop]
    cart     = PLACEHOLDER_VALUES[APP_MODE][:cart]
    payments = PLACEHOLDER_VALUES[APP_MODE][:payments]
    library  = APP_MODE == :production ? PLACEHOLDER_VALUES[:production][:library] : PLACEHOLDER_VALUES[LIB_MODE][:library]

    file     = Pathname.new filename
    output   = []
    file.readlines.each do |line|
      output << (
        line
        .gsub('@@shop',     shop)
        .gsub('@@cart',     cart)
        .gsub('@@payments', payments)
        .gsub('@@library',  library)
      )
    end
    file.write output.join ''
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
    cp '../../qworum-for-web-pages/build/qworum-for-web-pages.js', "src/qworum-for-web-pages/qworum-for-web-pages.mjs"
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

desc "Show the build parameters"
task :show_params do
    puts "Build parameters: APP_MODE == #{APP_MODE}, LIB_MODE == #{LIB_MODE}."
end
